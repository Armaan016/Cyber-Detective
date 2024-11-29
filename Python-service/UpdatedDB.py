import csv
from transformers import AutoTokenizer
from groq import Groq
import re
import time

client = Groq(api_key="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")

tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")

def call_groq_api(prompt, model="llama3-70b-8192", retries=5, delay=30):
    """Call Groq API with retry and rate limit handling."""
    for attempt in range(retries):
        try:
            response = client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model=model,
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error during Groq API call: {e}")
            if "rate limit" in str(e).lower():
                time.sleep(delay * (2 ** attempt))  
    return ""

def chunk_text(text, max_length=512):
    """Chunk text into segments with a maximum of 512 tokens."""
    tokens = tokenizer.tokenize(text)
    chunks = []
    for i in range(0, len(tokens), max_length):
        chunk_tokens = tokens[i:i + max_length]
        chunk = tokenizer.convert_tokens_to_string(chunk_tokens)
        chunks.append(chunk)
    return chunks

def generate_answers(question, text):
    """Generate answers for a specific question from the given text using Groq."""
    # prompt = (
    #     f"Answer the following question using only the text provided below. The answer must be word-for-word from the text.\n\n"
    #     f"Text:\n{text}\n\n"
    #     f"Question: {question}\n\n"
    #     f"Answer:"
    # )
    # response = call_groq_api(prompt)
    
    answer = extract_answer(question, text)
    
    return answer.strip()

def process_csv(input_csv, output_csv):
    """Process the input CSV, keep questions intact, and generate answers."""
    with open(input_csv, 'r', encoding='utf-8') as infile, open(output_csv, 'w', encoding='utf-8', newline='') as outfile:
        reader = csv.DictReader(infile)
        fieldnames = reader.fieldnames
        writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        writer.writeheader()

        for row in reader:
            scraped_content = row["Scraped Content"]
            questions = row["Questions"].split('\n')

            chunks = chunk_text(scraped_content)

            answers = []
            for question in questions:
                answer_found = False
                for chunk in chunks:
                    answer = generate_answers(question, chunk)
                    if answer and answer.lower() not in ["", "not found", "no answer"]:
                        answers.append(answer)
                        answer_found = True
                        break
                if not answer_found:
                    answers.append("No suitable answer found in the text.")

            row["Questions"] = "\n".join(questions)
            row["Answers"] = "\n".join(answers)

            writer.writerow(row)
            
def extract_answer(question, content):
    from transformers import pipeline

    # Load QA model
    qa_pipeline = pipeline("question-answering", model="distilbert-base-cased-distilled-squad")

    # Use QA model to get the probable answer
    qa_input = {
        'question': question,
        'context': content
    }
    result = qa_pipeline(qa_input)
    potential_answer = result['answer']

    # Verify exact match in content
    if potential_answer in content:
        return potential_answer
    else:
        print("No exact match found, trying fallback strategies...")
        # Alternative strategies can be added here, e.g., longest common substring
        return None

if __name__ == "__main__":
    input_csv = "./Final Merged Database CSV.csv"  
    output_csv = "output.csv"  
    process_csv(input_csv, output_csv)
