import React, { useState } from 'react';
import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './Sidebar';

const Tokens = () => {
    const [url, setUrl] = useState('');
    const [tokens, setTokens] = useState([]);

    const backendUrl = process.env.REACT_APP_BACKEND_URI || 'localhost';

    const handleScrape = async (e) => {
        e.preventDefault();
        if (!url) {
            toast.error('URL is a required field!');
            return;
        }

        try {
            toast.info('Annotating website...');
            const response = await Axios.post(`http://${backendUrl}:8082/tokens`, { url });
            if (response.status === 200) {
                toast.success('Website scraped and tokens annotated successfully!');
                setUrl('');
                console.log(response.data);

                setTokens(response.data);
            }
        } catch (err) {
            toast.error('Failed to scrape website!');
            console.error(err);
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
                    <h2 style={{ fontSize: '29px' }}>Annotate Text from Website</h2>
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

            {tokens.length > 0 && (
                <div className='auth-form-container'>
                    <h3>Scraped Words and Tags</h3>
                    <table className='tokens-table'>
                        <thead>
                            <tr>
                                <th>Word</th>
                                <th>Count</th>
                                <th>Tag</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tokens.map((token, index) => (
                                <tr key={index}>
                                    <td>{token.word}</td>
                                    <td>{token.count}</td>
                                    <td>{token.tag}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Sidebar />
        </>
    );
};

export default Tokens;
