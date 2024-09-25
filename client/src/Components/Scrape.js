import React, { useState } from 'react';
import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ScrapePage = () => {
    const [url, setUrl] = useState('');
    const [scrapedText, setScrapedText] = useState('');

    const handleScrape = async (e) => {
        e.preventDefault();
        if (!url) {
            toast.error('URL is a required field!');
            return;
        }

        if (scrapedText) {
            setScrapedText('');
        }
        try {
            toast.info('Scraping website...');
            const response = await Axios.post('http://localhost:8080/scrape', { url });
            setScrapedText(response.data.text);
        } catch (err) {
            setScrapedText('');
        }
    };

    return (
        <div className='auth-form-container'>
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
            <form className='auth-form' style={{ maxWidth: '500px' }}>
                <h2 style={{ fontSize: '30px' }}>Scrape any website</h2>
                <input
                    type="text"
                    placeholder="Enter URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    style={{ fontSize: '16px' }}
                />
                <button onClick={handleScrape} style={{ fontSize: '16px' }}>Scrape Website</button>
            </form>
            {scrapedText && (
                <div className='displayedText'>
                    <div>
                        <h3 style={{ textDecoration: 'underline' }}>Scraped Text:</h3>
                        <pre>{scrapedText}</pre>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScrapePage;