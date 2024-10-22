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
