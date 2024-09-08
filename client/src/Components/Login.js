import { React, useState } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import '../App.css';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    // const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(username, password);

        if (!username || !password) {
            alert("Please fill in all fields");
            return;
        }

        try {
            const response = await Axios.post("http://localhost:8080/login", {
                username,
                password
            });

            console.log(response);

            if (response.status === 200) {
                alert("Login successful");
                console.log("Login Successful!");
                // setTimeout(() => navigate('/'), 2000);
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                alert("Invalid credentials");
                console.log("Invalid credentials");
            } else {
                alert("An error occurred. Please try again later");
                console.log("An error occurred. Please try again later");
            }
        } finally {
            setUsername("");
            setPassword("");
        }
    }
    return (
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
                    <h6>Don't have an account? Register</h6>
                </Link>
            </form>
        </div>
    )
}

export default Login