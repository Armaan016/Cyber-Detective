import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import kmit_image from './Images/kmit.webp';
import website_image from './Images/website_image.webp';
import questions_image from './Images/questions_image.webp';
import annotations_image from './Images/annotation.jpg';
import data_image from './Images/data.webp';
import dataset_image from './Images/dataset.webp';

const Home = () => {
    useEffect(() => {
        const handleScroll = () => {
            const introBoxes = document.querySelectorAll('.image-description-box');
            introBoxes.forEach((box) => {
                const rect = box.getBoundingClientRect();
                if (rect.top < window.innerHeight) {
                    box.classList.add('visible');
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="home">
            <nav className="navbar">
                <div className="container">
                    <ul className="navbar-nav">
                        <li><Link to="/kmit">Ask KMIT Queries</Link></li>
                        <li><Link to="/scrape">Scrape any Website</Link></li>
                        <li><Link to="/tokens">Annotate Text</Link></li>
                        <li><Link to="/generate">Generate Q&A</Link></li>
                        <li><Link to="/qa">Ask Questions</Link></li>
                        <li><Link to="/dataset">View Dataset</Link></li>
                        <li><Link to="/" style={{ color: 'red' }}>LOG OUT</Link></li>
                    </ul>
                </div>
            </nav>

            <header className="hero-section">
                <h1>Welcome to CyberDetective</h1>
                <p>Your One-Stop Solution for Cybersecurity Queries and Advice</p>
                <p style={{ color: 'antiquewhite' }}>Welcome to CyberDetective! Your all-in-one platform for exploring cybersecurity tools and solutions. From answering queries to web scraping, text annotation, and Q&A generation, we've got you covered. Dive into datasets, ask questions, and unleash powerful insights for your projects. Scroll down for more information!</p>
            </header>

            <div className="main__action">
                <a className="main__scroll" href="#intro">
                    <div className="main__scroll-box" style={{ backgroundColor: 'white' }}>
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" >
                            <path d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M11.9997 13.1716L7.04996 8.22186L5.63574 9.63607L11.9997 16L18.3637 9.63607L16.9495 8.22186L11.9997 13.1716Z" fill="rgba(28,28,30,1)"></path>
                        </svg>
                    </div>
                </a>
                <span className="main__scroll-text" style={{ left: '100px' }}>Scroll</span>
            </div>

            <section className="image-description-section">
                <Link to='/kmit' style={{ textDecoration: 'none' }}>
                    <div className="image-description-box">
                        <img src={kmit_image} alt="KMIT Queries" />
                        <div className="image-description-text">
                            <h3>KMIT Queries</h3>
                            <p>Access this feature to ask any query related to KMIT. It utilizes Retrieval-Augmented Generation (RAG) techniques after scraping the official KMIT website. The scraping process employs BeautifulSoup for parsing the HTML content, while the msmarco sentence transformer encodes the data to provide relevant answers. The RAG architecture seamlessly integrates the scraped data with a question-answering system to deliver precise and contextual responses to your queries.</p>
                        </div>
                    </div>
                </Link>

                <Link to='/scrape' style={{ textDecoration: 'none' }}>
                    <div className="image-description-box">
                        <img src={website_image} alt="Scrape Websites" />
                        <div className="image-description-text">
                            <h3>Scrape Websites</h3>
                            <p>Use this tool to extract data from any URL effortlessly. By entering a website link, the page is parsed using standard HTML parsing techniques, bypassing the need for third-party libraries. This lightweight and efficient scraper is perfect for quick data collection and allows you to retrieve web content with minimal setup, focusing solely on built-in functionality for simplicity and reliability.</p>
                        </div>
                    </div>
                </Link>

                <Link to='/tokens' style={{ textDecoration: 'none' }}>
                    <div className="image-description-box">
                        <img src={annotations_image} alt="Text Annotation" />
                        <div className="image-description-text">
                            <h3>Annotate Text</h3>
                            <p>This feature lets you annotate text intelligently. Enter a URL, and the web page is first scraped using Puppeteer for advanced scraping. The extracted content is then passed to a random forest model, which tags each word based on its context. This process enhances understanding and categorization, making it ideal for labeling textual data in research or machine learning projects.</p>
                        </div>
                    </div>
                </Link>

                <Link to='/generate' style={{ textDecoration: 'none' }}>
                    <div className="image-description-box">
                        <img src={data_image} alt="Generate Q&A" />
                        <div className="image-description-text">
                            <h3>Generate Q&A</h3>
                            <p>Generate questions and answers from any website with this feature. By entering a URL, the page is scraped using newspaper3k, and the content is forwarded to the Groq API, which generates question-answer pairs. This tool is highly effective for educators, researchers, or anyone needing automated Q&A sets for training or academic purposes.</p>
                        </div>
                    </div>
                </Link>

                <Link to='/qa' style={{ textDecoration: 'none' }}>
                    <div className="image-description-box">
                        <img src={questions_image} alt="Ask Questions" />
                        <div className="image-description-text">
                            <h3>Ask Questions</h3>
                            <p>Pose queries related to cybersecurity, and this feature provides accurate responses powered by a fine-tuned BERT model. Whether it’s basic concepts or in-depth cybersecurity challenges, the system leverages its trained model to offer relevant, reliable, and context-aware answers in seconds, ensuring your queries are resolved efficiently.</p>
                        </div>
                    </div>
                </Link>

                <Link to='/dataset' style={{ textDecoration: 'none' }}>
                    <div className="image-description-box">
                        <img src={dataset_image} alt="View Dataset" />
                        <div className="image-description-text">
                            <h3>View Dataset</h3>
                            <p>Explore a meticulously crafted dataset that combines context, generated questions, and their corresponding answers. This resource is a result of extensive research and data generation, designed to assist with various projects, experiments, or training models. It provides reliable and structured information to boost your productivity and insight into data science tasks.</p>
                        </div>
                    </div>
                </Link>
            </section>
        </div>
    );
};

export default Home;
