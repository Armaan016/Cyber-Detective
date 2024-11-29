# import os
# from urllib.request import Request
from urllib.error import HTTPError
from newspaper import Article, network
from groq import Groq
from sentence_transformers import SentenceTransformer, util
import torch
import spacy
import os
# import urllib.request

nlp = spacy.load("en_core_web_sm")

# def patched_request(method, url, **kwargs):
#     proxies = {
#         "http": "49.249.155.3:8080",   
#         "https": "49.249.155.3:8080", 
#     }
    
#     proxy_support = urllib.request.ProxyHandler(proxies)
#     opener = urllib.request.build_opener(proxy_support)
#     urllib.request.install_opener(opener)

#     headers = kwargs.pop('headers', {})
#     headers.update({"User-Agent": "Mozilla/5.0"})

#     req = urllib.request.Request(url, headers=headers)

#     return network.requests.request(method, req.get_full_url(), **kwargs)


# network.requests.request = patched_request

def generate_qa(content):
    print(f"Generating Q&A for content: {content[:100]}...")
    return "Here are the 30 questions and answers:\n\nQ: What is cybersecurity?\nA: The practice of protecting systems, networks, and programs from digital attacks.\n\nQ: What are cyberattacks aimed at doing?\nA: Accessing, changing, or destroying sensitive information; extorting money from users through ransomware; or interrupting normal business processes.\n\nQ: Why is implementing effective cybersecurity measures challenging?\nA: Because there are more devices than people, and attackers are becoming more innovative.\n\nQ: What is a successful cybersecurity posture characterized by?\nA: Multiple layers of protection spread across computers, networks, programs, or data.\n\nQ: What can a unified threat management gateway system do?\nA: Automate integrations across products and accelerate key security operations functions: detection, investigation, and remediation.\n\nQ: What three elements must complement each other for effective defense?\nA: People, processes, and technology.\n\nQ: What must users understand and comply with?\nA: Basic data protection and privacy security principles.\n\nQ: What are some basic cybersecurity principles?\nA: Choosing strong passwords, being wary of attachments in email, and backing up data.\n\nQ: Where can I learn more about basic cybersecurity principles?\nA: From these Top 10 Cyber Tips (PDF).\n\nQ: What is essential for organizations to have?\nA: A framework for how they deal with both attempted and successful cyberattacks.\n\nQ: What is a well-respected model for dealing with cyberattacks?\nA: The NIST cybersecurity framework.\n\nQ: What does the NIST cybersecurity framework explain?\nA: How to identify attacks, protect systems, detect and respond to threats, and recover from successful attacks.\n\nQ: What technology is essential for?\nA: Giving organizations and individuals the computer security tools needed to protect themselves from cyberattacks.\n\nQ: What three main entities must be protected?\nA: Endpoint devices like computers, smart devices, and routers; networks; and the cloud.\n\nQ: What is an example of technology used to protect endpoint devices?\nA: Next-generation firewalls.\n\nQ: What is an example of technology used to protect networks?\nA: Domain Name System (DNS) filtering.\n\nQ: What is an example of technology used to protect the cloud?\nA: Malware protection.\n\nQ: What is another example of technology used to protect systems?\nA: Antivirus software.\n\nQ: What is another example of technology used to protect email?\nA: Email security solutions.\n\nQ: How many devices are there in the world?\nA: More than people.\n\nQ: Are cyberattackers becoming more innovative?\nA: Yes.\n\nQ: Is cybersecurity only about protecting computers?\nA: No, it's about protecting systems, networks, and programs.\n\nQ: Is a single layer of protection enough?\nA: No, a successful cybersecurity posture has multiple layers of protection.\n\nQ: Can technology alone defend against cyberattacks?\nA: No, people, processes, and technology must complement each other.\n\nQ: What is the goal of cyberattacks?\nA: Accessing, changing, or destroying sensitive information; extorting money from users through ransomware; or interrupting normal business processes.\n\nQ: Can individuals protect themselves from cyberattacks?\nA: Yes, by understanding and complying with basic data protection and privacy security principles.\n\nQ: Are organizations responsible for protecting themselves from cyberattacks?\nA: Yes, they must have a framework for dealing with both attempted and successful cyberattacks.\n\nQ: What is the role of people in cybersecurity?\nA: Understanding and complying with basic data protection and privacy security principles.\n\nQ: What is the role of processes in cybersecurity?\nA: Having a framework for dealing with both attempted and successful cyberattacks.\n\nQ: What is the role of technology in cybersecurity?\nA: Providing computer security tools needed to protect systems from cyberattacks."

    client = Groq(api_key=os.environ.get("GROQ_APIKEY"))    
    prompt = f"Generate 30 questions and 30 answers, in the format Q: followed by the question and then the next line as A: followed by the answer. Give only the Q&A and no other text. Here is the content: \n\n{content}"
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama3-70b-8192",
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        print(f"Error in generate_qa: {e}")
        return "Error generating Q&A"

    
def process_url(url):
    print(f"Processing URL: {url}")
    try:
        article = Article(url, fetch_images=False)
        article.download()
        article.parse()
        scraped_text = article.text

        print(f"Scraped text: {scraped_text[:100]}...")

        # base_filename = url.replace("https://", "").replace("http://", "").replace("/", "_").replace(".", "_")
        # scraped_txt_filename = f"{base_filename}.txt"
        # with open(scraped_txt_filename, 'w', encoding='utf-8') as file:
        #     file.write(scraped_text)
        # print(f"Scraped text saved as {scraped_txt_filename}")

        qa_content = generate_qa(scraped_text)
        print(f"Q&A: {qa_content}")

        # qa_txt_filename = f"{base_filename}_QA.txt"
        # with open(qa_txt_filename, 'w', encoding='utf-8') as file:
        #     file.write(qa_content)
        # print(f"Q&A saved as {qa_txt_filename}")
        
        return {
            "scraped_text": scraped_text,
            "qa_content": qa_content
        }, 200

    except Exception as e:
        print(f"An error occurred with {url}: {e}")
        
def get_relevant_contexts(query, scraped_text, window_size=3):
    doc = nlp(scraped_text.strip())
    sentences = [sent.text for sent in doc.sents]
    
    sentence_windows = [
        " ".join(sentences[i:i + window_size]) for i in range(len(sentences) - window_size + 1)
    ]
    # print(sentence_windows)
    
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    context_model = SentenceTransformer("msmarco-MiniLM-L-12-v3").to(device)
    
    window_embeddings = context_model.encode(sentence_windows, convert_to_tensor=True).to(device)
    query_embedding = context_model.encode(query, convert_to_tensor=True).to(device)
    
    cosine_scores = util.pytorch_cos_sim(query_embedding, window_embeddings)
    
    top_k = torch.topk(cosine_scores, k=3)
    top_contexts = [sentence_windows[idx] for idx in top_k.indices[0].tolist()]

# urls = [
#   "https://www.mozilla.org/en-US/security/",
#   "https://www.britannica.com/topic/cyberattack",
#  " https://www.payplug.com/blog/online-payment-only-45-of-online-shoppers-know-about-that-sms-authentication-is-soon-coming-to-an-end/"
# ]

# for url in urls:
#     process_url(url)