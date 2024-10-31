import os
from urllib.request import Request
from urllib.error import HTTPError
from newspaper import Article
from groq import Groq

client = Groq(api_key="my-api-key")  

def generate_qa(content):
    prompt = f"Generate 30 questions and 30 answers, in the format Q: followed by the question and then the next line as A: followed by the answer. Give only the Q&A and no other text. Here is the content: \n\n{content}"
    chat_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama3-8b-8192",
    )
    return chat_completion.choices[0].message.content

def process_urls(urls):
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}

    for url in urls:
        print(f"Processing URL: {url}")
        try:
            article = Article(url)
            article.download()
            article.parse()
            scraped_text = article.text

            base_filename = url.replace("https://", "").replace("http://", "").replace("/", "_").replace(".", "_")

            scraped_txt_filename = f"{base_filename}.txt"
            with open(scraped_txt_filename, 'w', encoding='utf-8') as file:
                file.write(scraped_text)
            print(f"Scraped text saved as {scraped_txt_filename}")

            qa_content = generate_qa(scraped_text)

            qa_txt_filename = f"{base_filename}_QA.txt"
            with open(qa_txt_filename, 'w', encoding='utf-8') as file:
                file.write(qa_content)
            print(f"Q&A saved as {qa_txt_filename}")

        except HTTPError as e:
            print(f"HTTP Error for {url}: {e.code}")
        except Exception as e:
            print(f"An error occurred with {url}: {e}")

urls = [
  "https://www.mozilla.org/en-US/security/",
  "https://www.britannica.com/topic/cyberattack",
 " https://www.payplug.com/blog/online-payment-only-45-of-online-shoppers-know-about-that-sms-authentication-is-soon-coming-to-an-end/"
]

process_urls(urls)
