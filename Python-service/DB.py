import os
import csv
import newspaper
from newspaper import Article
from groq import Groq
from concurrent.futures import ThreadPoolExecutor, as_completed
import time

client = Groq(api_key="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")

newspaper.settings.CACHE_DIRECTORY = 'cache_directory'

def generate_qa(content):
    prompt = f"Generate 30 questions and 30 answers in the format: Q1, A1, Q2, A2, etc. Provide only the Q&A, no additional text. Here is the content:\n\n{content}"
    return call_groq_api(prompt, "llama3-70b-8192")

def summarize(content):
    prompt = f"Summarize the content below, keeping only information related to cybersecurity and cyberattacks:\n\n{content}"
    return call_groq_api(prompt, "llama3-70b-8192")

def call_groq_api(prompt, model, retries=5, delay=30):
    """Call Groq API with retry and rate limit handling."""
    for attempt in range(retries):
        try:
            chat_completion = client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model=model,
            )
            return chat_completion.choices[0].message.content
        except Exception as e:
            error_message = str(e)
            if "rate limit" in error_message.lower():
                wait_time = delay * (2 ** attempt)  # Exponential backoff
                print(f"Rate limit reached. Waiting for {wait_time} seconds before retrying...")
                time.sleep(wait_time)
            else:
                print(f"Error in call_groq_api: {e}")
                return ""
    print("Failed to get response after multiple retries.")
    return ""

def sanitize_filename(url):
    """Generates a safe filename from a URL."""
    return ''.join(c for c in url if c.isalnum() or c in '-_')

def extract_qa_pairs(qa_content):
    """Extracts questions and answers from the generated Q&A content."""
    try:
        qa_pairs = [line.strip() for line in qa_content.split('\n') if line.strip()]
        questions = "\n".join([qa_pairs[i][3:] for i in range(0, len(qa_pairs), 2) if qa_pairs[i].startswith("Q")])
        answers = "\n".join([qa_pairs[i][3:] for i in range(1, len(qa_pairs), 2) if qa_pairs[i].startswith("A")])
        return questions, answers
    except IndexError:
        print("Error in extracting Q&A pairs.")
        return "", ""

def process_url(url):
    try:
        print(f"Processing URL: {url}")

        article = Article(url)
        article.download()
        article.parse()
        scraped_text = article.text

        if not scraped_text:
            print(f"No content found for {url}")
            return None

        base_filename = sanitize_filename(url)

        scraped_txt_filename = f"{base_filename}.txt"
        with open(scraped_txt_filename, 'w', encoding='utf-8') as file:
            file.write(scraped_text)
        print(f"Scraped text saved as {scraped_txt_filename}")

        qa_content = generate_qa(scraped_text)
        qa_txt_filename = f"{base_filename}_QA.txt"
        with open(qa_txt_filename, 'w', encoding='utf-8') as file:
            file.write(qa_content)
        print(f"Q&A saved as {qa_txt_filename}")

        summarized_content = summarize(scraped_text)
        questions, answers = extract_qa_pairs(qa_content)

        return {
            'URL': url,
            'Scraped Content': summarized_content,
            'Questions': questions,
            'Answers': answers,
        }

    except Exception as e:
        print(f"An error occurred while processing {url}: {e}")
        return None

def process_urls(urls, output_csv="output.csv", max_workers=5):
    """Processes a list of URLs and saves the results to a CSV file."""
    with open(output_csv, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['URL', 'Scraped Content', 'Questions', 'Answers']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()

        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_url = {executor.submit(process_url, url): url for url in urls}

            for i, future in enumerate(as_completed(future_to_url), start=1):
                result = future.result()
                if result:
                    writer.writerow(result)
                    print(f"Data saved for URL: {result['URL']} ({i}/{len(urls)})")

if __name__ == "__main__":
    urls = [
        "https://www.welivesecurity.com/en/business-security/beyond-checkbox-demystifying-cybersecurity-compliance/",
        "https://www.welivesecurity.com/en/cybercrime/dont-become-statistic-defending-data-dark-web/",
        "https://gridinsoft.com/adware",
        "https://medium.com/@Cyb3rsecurity/demystifying-cybersecurity-threats-a-guide-to-different-attack-types-5e21e7351c95",
        "https://medium.com/@Cyb3rsecurity/vulnerability-scanning-v-s-penetration-testing-1214980c54ec"
    ]

    process_urls(urls, output_csv="output.csv", max_workers=5)