import { React, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import emailjs from '@emailjs/browser';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [userEnteredOtp, setUserEnteredOtp] = useState("");
    const [generatedOtp, setGeneratedOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const navigate = useNavigate();
    const rec_email = useRef(null);

    const backendUrl = process.env.REACT_APP_BACKEND_URI || 'localhost';

    const generateRandomOtp = () => {
        return Math.floor(1000 + Math.random() * 9000);
    };

    const sendEmailOTP = async () => {
        if (!email) {
            toast.error("You cannot leave the email field empty!");
            return;
        }

        const otp = generateRandomOtp();
        setGeneratedOtp(otp);

        try {
            await emailjs.send('service_vch1h4d', 'template_ganoskb', {
                to_email: rec_email.current.value, otp: otp, to_name: name
            }, '1q-KhArbKwicHV8HG');

            toast.success("OTP sent successfully!");
            setIsOtpSent(true);
        } catch (error) {
            toast.error("Failed to send email OTP. Please try again.");
            console.log("Error: ", error);
        }
    };

    const verifyEmailOTP = (e) => {
        e.preventDefault();

        if (userEnteredOtp === generatedOtp.toString()) {
            toast.success("OTP verified successfully!");
            setIsOtpVerified(true);
        } else {
            toast.error("Invalid OTP. Please try again.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email || !username || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        if (!isOtpVerified) {
            toast.error("Please verify the OTP before registering.");
            return;
        }

        try {
            console.log("Sending registration request...");
            const response = await Axios.post(`http://${backendUrl}:8082/register`, {
                name,
                email,
                username,
                password
            });

            if (response.status === 200) {
                toast.success("Registration successful");
                setTimeout(() => navigate('/'), 1600);
            } else {
                toast.error("An error occurred. Please try again later");
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error("Username already exists. Please choose a different one.");
            } else if (error.response && error.response.status === 500) {
                toast.error("Internal server error. Please try again later");
            } else {
                toast.error("An unknown error occurred. Please try again later");
            }
        } finally {
            setName("");
            setEmail("");
            setUsername("");
            setPassword("");
        }
    };

    return (
        <>
            <ToastContainer position="top-center"
                autoClose={1000}
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
            <div className="auth-form-container">
                <form className="auth-form" onSubmit={handleSubmit}>
                    <h2>Register</h2>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        ref={rec_email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <p style={{ fontSize: '16px', margin: '8px 0', color: 'white' }}>(An OTP will be sent to your email for verification)</p>
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
                    {!isOtpSent && (
                        <button type="button" onClick={sendEmailOTP}>Send OTP</button>
                    )}
                    <Link to='/' className="navigation-link">
                        <p>Already a user? Login</p>
                    </Link>
                    {isOtpSent && !isOtpVerified && (
                        <>
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={userEnteredOtp}
                                onChange={(e) => setUserEnteredOtp(e.target.value)}
                            />
                            <button type="button" onClick={verifyEmailOTP}>Verify OTP</button>
                        </>
                    )}
                    {isOtpVerified && (
                        <button type="submit">Register</button>
                    )}
                </form>
            </div>
        </>
    )
}

export default Register;
