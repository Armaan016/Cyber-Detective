import React, { useState } from 'react';
import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './Sidebar';

const ScrapePage = () => {
    const [url, setUrl] = useState('');
    const [scrapedText, setScrapedText] = useState('');
    const [qaContent, setQaContent] = useState('');

    const handleScrape = async (e) => {
        e.preventDefault();
        if (!url) {
            toast.error('URL is a required field!');
            return;
        }

        try {
            toast.info('Scraping website...');
            const response = await Axios.post('http://localhost:8082/generate', { url });
            setScrapedText(response.data.scraped_text);
            setQaContent(response.data.qa_content);
        } catch (err) {
            toast.error('Failed to scrape the website or generate Q&A.');
            setScrapedText('');
            setQaContent('');
        }
    };

    return (
        <>
            <ToastContainer position="top-center"
                autoClose={1500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme='light'
                toastStyle={{ fontSize: '16px' }}
                bodyClassName="custom-toast-body"
                progressBarStyle={{ background: 'white' }} />
            <div className='auth-form-container'>
                <form className='auth-form' style={{ maxWidth: '500px' }}>
                    <h2 style={{ fontSize: '25px' }}>Scrape any website and Generate Q&A</h2>
                    <input
                        type="text"
                        placeholder="Enter URL"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        style={{ fontSize: '16px' }}
                    />
                    <button onClick={handleScrape} style={{ fontSize: '16px' }}>Generate QA</button>
                </form>
                {scrapedText && (
                    <div className='llm-response'>
                        <div>
                            <h3 style={{ textDecoration: 'underline' }}>Scraped Text:</h3>
                            <p>{scrapedText}</p>
                        </div>
                        {qaContent && (
                            <div>
                                <h3 style={{ textDecoration: 'underline' }}>Generated Q&A:</h3>
                                <pre>{qaContent}</pre>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <Sidebar />
        </>
    );
};

export default ScrapePage;
