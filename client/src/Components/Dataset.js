import axios from "axios";
import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "./Sidebar";

const ViewDatabase = () => {
    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get("http://localhost:8082/dataset");
            toast.success("Data Fetched");
            const result = await response.data;
            setData(result);
        } catch (err) {
            toast.error("Failed to fetch data");
        }
    };

    const columnOrder = ["context", "question", "answer"];

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
                theme="light"
                toastStyle={{ fontSize: "16px" }}
                bodyClassName="custom-toast-body"
                progressBarStyle={{ background: "white" }} />
            <div className="auth-form-container">
                <h1>View Database</h1>
                <button onClick={fetchData} style={{ marginBottom: "20px" }}>
                    Load Data
                </button>
                {data.length > 0 && (
                    <table className="tokens-table">
                        <thead>
                            <tr>
                                {columnOrder.map((key) => (
                                    <th key={key}>{key}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, index) => (
                                <tr key={index}>
                                    {columnOrder.map((key) => (
                                        <td key={key}>{row[key]}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                <Sidebar />
            </div>
        </>
    );
};

export default ViewDatabase;
