import axios from "axios";
import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "./Sidebar";

const ViewDatabase = () => {
    const [data, setData] = useState([]);
    const backendUrl = process.env.REACT_APP_BACKEND_URI || 'localhost';
    const flaskUrl = process.env.REACT_APP_PYTHON_URI || 'localhost';

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://${backendUrl}:8082/dataset`);
            toast.success("Data Fetched");
            const result = await response.data;
            setData(result);
        } catch (err) {
            toast.error("Failed to fetch data");
        }
    };

    const downloadDataset = () => {
        console.log("flaskUrl", flaskUrl);
        const url = `http://${flaskUrl}/download-dataset`;
        const link = document.createElement('a');
        link.href = url;
        link.download = 'CyberDetectiveDataset.csv';
        link.click();
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
                    <>
                        <button onClick={downloadDataset} style={{ position: 'absolute', left: '72%', top: '20px', marginBottom: "10px", marginLeft: "10px" }}>
                            Download Dataset
                        </button>
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
                    </>
                )}
                <Sidebar />
            </div>
        </>
    );
};

export default ViewDatabase;
