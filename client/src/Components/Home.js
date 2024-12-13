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
            const introBoxes = document.querySelectorAll('.intro-box');
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
            </header>

            {/* Scroll Down Arrow */}
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

            <section id="intro" className="intro-section">
                <div className="intro-box">
                    <Link to='/kmit'>
                        <img src={kmit_image} alt="Component 1" />
                        <h3>KMIT Queries</h3>
                    </Link>
                </div>
                <div className="intro-box">
                    <Link to='/scrape'>
                        <img src={website_image} alt="Component 2" />
                        <h3>Scrape any Website</h3>
                    </Link>
                </div>
                <div className="intro-box">
                    <Link to='/tokens'>
                        <img src={annotations_image} alt="Component 3" />
                        <h3>Annotate Text</h3>
                    </Link>
                </div>
                <div className="intro-box">
                    <Link to='/generate'>
                        <img src={data_image} alt="Component 4" />
                        <h3>Generate Q&A</h3>
                    </Link>
                </div>
                <div className="intro-box">
                    <Link to='/qa'>
                        <img src={questions_image} alt="Component 5" />
                        <h3>Ask Questions</h3>
                    </Link>
                </div>
                <div className="intro-box">
                    <Link to='/dataset'>
                        <img src={dataset_image} alt="Component 5" />
                        <h3>View Dataset</h3>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
