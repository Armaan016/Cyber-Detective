# Cyber-Detective

## Introduction:
Investigating and attributing cyber-attacks are crucial processes that allow cybersecurity experts to implement efficient countermeasures and pursue legal actions. Cyber-attack attribution helps identify the attackers responsible for cyber-attacks, enabling experts to take attacker-oriented countermeasures.

This project, RAG-Cyber-Detective, aims to develop a web-based Question Answering (QA) model that assists cybersecurity experts in their investigations. The QA model will provide answers to queries based on either a curated knowledge base (KB) or external resources provided by users, utilizing Retrieval-Augmented Generation (RAG) techniques together with a Large Language Model (LLM).

<br>

## Tech Stack:
Frontend: React.js
<br>
Backend: Node.js, Express.js
<br>
Database: MongoDB
<br>
Containerization: Docker
<br>
Cloud Services: AWS
<br>
GenAI Integration: Large Language Model (LLM) and Retrieval-Augmented Generation (RAG)
<br>

## Features:
<br>
Web-based QA platform for cybersecurity experts
<br>
Hybrid approach: KB + User-provided data for answering queries
<br>
Scalable, containerized deployment using Docker and AWS
<br>

## Installation:
1. Clone this repository: "git clone https://github.com/Armaan016/cyber-detective.git"
2. Navigate to the directory: "cd cyber-detective"
3. Install dependencies:  "npm install" (For frontend and backend) "pip install -r requirements.txt" (For Python scripts)
4. Start Docker containers: "docker-compose up" (Create a docker-compose.yml first)

<br>

## Progress:
## Start Date: 6th September, 2024
<br>
Commit 1: 8th September, 2024
<br>
Tasks Completed:
1. Implemented login and registration pages for user authentication.
2. Integrated email verification using the 'emailjs' module before completing registration.
3. Configured MongoDB to store user data.
<br>

<br>
Commit 2: 18th September, 2024
<br>
Tasks Completed:
1. Successfully scraped content from kmit.in and saved the extracted text locally.
2. Integrated RAG (Retrieval-Augmented Generation) to fetch relevant information in response to user queries.
3. Incorporated FAISS as the vector database for efficient similarity search.
<br>

<br>
Commit 3: 1st October, 2024
<br>
Tasks Completed:
1. Implemented scraping for website URLs provided by users.
2. Processed the AttackER dataset to classify individual words.
3. Tagged each word in the scraped text with its corresponding token based on the AttackER dataset and stored the results in MongoDB.
<br>

<br>
Commit 4: 4th October, 2024
<br>
Tasks Completed:
1. Developed functionality to annotate user-provided text from a URL.
2. Fully containerized the entire application using Docker for easier deployment and management.
<br>

<br>
Commit 5: 8th October, 2024
<br>
Tasks Completed:
1. Set up a Flask server to handle Python script execution for backend processing.
<br>

<br>
Commit 6: 16th October, 2024
<br>
Tasks Completed:
1. Set up hot-reloading functionality within Docker.
<br>

<br>
Commit 7: 22nd October, 2024
<br>
Tasks Completed:
1. Implemented web-scraping without using third-party libraries.
<br>

<br>
Commit 8: 31st October, 2024
<br>
Tasks Completed:
1. Integrated newspaper3k library to improve efficiency and accuracy in web scraping for article-based content extraction. 
2. Added Q&A generation functionality using `Groq` API for extracted article text. 
3. Ensured scraped content and generated question-answers are saved in a structured format for better file organization.
<br>

<br>
Commit 9: 19th November, 2024
<br>
Tasks Completed:
1. Created a dataset containing scraped text, questions and answers from 35 URLs related to cyber-security.
<br>

<br>
Commit 10: 29th November, 2024
<br>
Tasks Completed:
1. Implemented RAG for the previously stored questions & answers. 
2. Trained and deployed a BERT model for question-answering on hugging-face.
<br>

<br>
Commit 11: 13th December, 2024
<br>
Tasks Completed:
1. Added a View Component page in frontend, which displays few rows of the dataset.
2. Made improvements to User Interface.
<br>

<br>
Commit 12: 26th December, 2024
<br>
Tasks Completed:
1. Made final minor modifications to project.
<br>
