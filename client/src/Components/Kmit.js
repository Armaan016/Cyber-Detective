import React, { useState } from 'react';
import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './Sidebar';

const Kmit = () => {
    const [query, setQuery] = useState("");
    const [answer, setAnswer] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (answer) {
            setAnswer("");
        }
        if (!query) {
            toast.error("Please enter a query");
            return;
        }

        try {
            console.log("Query: ", query);
            toast.info("Querying LLM. Please wait...");
            const response = await Axios.post("http://localhost:8082/query", { query });
            console.log(response);
            if (response.status === 200) {
                console.log(response.data);
                setAnswer(response.data);
            }
        } catch (error) {
            // alert("An error occurred. Please try again later");
            toast.error("An error occurred. Please try again later");
            console.log("An error occurred. Please try again later: ", error);
        } finally {
            setQuery("");
        }
    }
    return (
        <>
            <ToastContainer position="top-center"
                autoClose={2000}
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
                <form className="auth-form" style={{ maxWidth: '600px' }} onSubmit={handleSubmit}>
                    <h2 style={{ fontSize: '29px' }}>Ask any query related to KMIT</h2>
                    <input type="text" placeholder='Enter a query for LLM' onChange={(e) => { setQuery(e.target.value) }} style={{ width: '500px' }} />
                    <button type="submit">Submit</button>
                </form>

                {answer && (<div className='llm-response' >
                    <h3>Response:</h3>
                    <pre style={{ overflow: 'auto' }}>{answer}</pre>

                </div>)}
            </div>
            <Sidebar />
        </>
    )
}

export default Kmit;