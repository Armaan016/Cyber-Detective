import { React, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import '../App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(username, password);

        const backendUrl = process.env.REACT_APP_BACKEND_URI || 'localhost';
        console.log(backendUrl);
        if (!username || !password) {
            // alert("Please fill in all fields");
            toast.error("Please fill in all fields");
            return;
        }

        try {
            const response = await Axios.post(`http://${backendUrl}:8082/login`, {
                username,
                password
            });

            console.log(response);

            if (response.status === 200) {
                // alert("Login successful");
                toast.success("Login successful");
                console.log("Login Successful!");
                setTimeout(() => navigate('/home'), 2000);
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                // alert("Invalid credentials");
                console.log(error.response.data);
                toast.error("Invalid credentials");
                console.log("Invalid credentials");
            } else {
                // alert("An error occurred. Please try again later");
                toast.error("An error occurred. Please try again later");
                console.log("An error occurred. Please try again later");
            }
        } finally {
            setUsername("");
            setPassword("");
        }
    }
    return (
        <>
            <ToastContainer position="top-center"
                autoClose={1300}
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
                <form className="auth-form" onSubmit={handleSubmit}>
                    <h2>Login</h2>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">Login</button>
                    <Link to='/register' className="navigation-link">
                        <p>Don't have an account? Register</p>
                    </Link>
                </form>
            </div>
        </>
    )
}

export default Login