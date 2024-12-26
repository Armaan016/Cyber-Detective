import { useState } from "react";
import React from 'react';
import Sidebar from "./Sidebar";
import { toast, ToastContainer } from 'react-toastify';
import Axios from 'axios';


const Query = () => {
    const [query, setQuery] = useState('');
    const [answer, setAnswer] = useState('');

    const backendUrl = process.env.REACT_APP_BACKEND_URI || 'localhost';

    const handleScrape = async (e) => {
        e.preventDefault();
        if (answer) {
            setAnswer('');
        }

        if (!query) {
            toast.error('Query is a required field!');
            return;
        }

        try {
            toast.info('Querying model...');
            console.log(query);
            const response = await Axios.post(`http://${backendUrl}:8082/qa`, { query });
            if (response.status === 200) {
                // toast.success('Website scraped successfully and data saved in MongoDB!');
                console.log(response.data);

                setAnswer(response.data['answer']);
            }
        } catch (err) {
            toast.error('Failed to query model!');
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
                    <h2 style={{ fontSize: '29px' }}>Ask a Question</h2>
                    <input
                        type="text"
                        placeholder="Enter Query"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{ fontSize: '16px' }}
                    />
                    <button onClick={handleScrape} style={{ fontSize: '16px' }}>Annotate</button>
                </form>

                {answer && (<div className='llm-response' >
                    <h5>Response:</h5>
                    <p style={{ overflow: 'auto' }}>{answer}</p>

                </div>)}
            </div>

            <Sidebar />
        </>
    );
};

export default Query;