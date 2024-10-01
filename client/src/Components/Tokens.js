import React, { useState } from 'react';
import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './Sidebar';

const Tokens = () => {
    const [url, setUrl] = useState('');

    const handleScrape = async (e) => {
        e.preventDefault();
        if (!url) {
            toast.error('URL is a required field!');
            return;
        }

        try {
            toast.info('Annotating website...');
            const response = await Axios.post('http://localhost:8080/tokens', { url });
            if (response.status === 200) {
                toast.success('Website scraped successfully and data saved in MongoDB!');
                setUrl('');
            }
        } catch (err) {
            toast.error('Failed to scrape website!');
        }
    };

    return (
        <>
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
                <form className='auth-form' style={{ maxWidth: '500px', marginTop: '200px' }}>
                    <h2 style={{ fontSize: '29px' }}>Annotate Website and Store Tokens</h2>
                    <input
                        type="text"
                        placeholder="Enter URL"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        style={{ fontSize: '16px' }}
                    />
                    <button onClick={handleScrape} style={{ fontSize: '16px' }}>Annotate</button>
                </form>
            </div>
            <Sidebar />
        </>

    );
};

export default Tokens;
