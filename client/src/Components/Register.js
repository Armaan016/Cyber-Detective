import { React, useState, useRef } from 'react'
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

    const generateRandomOtp = () => {
        return Math.floor(1000 + Math.random() * 9000);
    };

    const sendEmailOTP = async () => {
        if (!email) {
            // alert("You cannot leave the email field empty!");
            toast.error("You cannot leave the email field empty!");
            return;
        }

        const otp = generateRandomOtp();
        setGeneratedOtp(otp);

        try {
            await emailjs.send('service_vch1h4d', 'template_ganoskb', {
                to_email: rec_email.current.value, otp: otp, to_name: name
            }, '1q-KhArbKwicHV8HG');

            // alert("OTP sent successfully!");
            toast.success("OTP sent successfully!");
            setIsOtpSent(true);
        } catch (error) {
            // alert("Failed to send email OTP. Please try again.");
            toast.error("Failed to send email OTP. Please try again.");
            console.log("Error: ", error);
        }
    };

    const verifyEmailOTP = (e) => {
        e.preventDefault();

        if (userEnteredOtp === generatedOtp.toString()) {
            alert("OTP verified successfully!");
            setIsOtpVerified(true);
            setTimeout(() => navigate('/'), 2000);
        } else {
            alert("Invalid OTP. Please try again.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email || !username || !password) {
            alert("Please fill in all fields");
            return;
        }

        if (!isOtpVerified) {
            alert("Please verify the OTP before registering.");
            return;
        }

        try {
            console.log("Sending registration request...");
            const response = await Axios.post("http://localhost:8080/register", {
                name,
                email,
                username,
                password
            });

            if (response.status === 200) {
                alert("Registration successful");
                setTimeout(() => navigate('/'), 2000);
            } else {
                alert("An error occurred. Please try again later");
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                alert("Username already exists. Please choose a different one.");
            } else if (error.response && error.response.status === 500) {
                alert("Internal server error. Please try again later");
            } else {
                alert("An unknown error occurred. Please try again later");
            }
        } finally {
            setName("");
            setEmail("");
            setUsername("");
            setPassword("");
        }
    };

    return (
        <div className="auth-form-container">
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
            <form className="auth-form" onSubmit={isOtpVerified ? handleSubmit : sendEmailOTP}>
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
                <p style={{ fontSize: '16px', margin: '8px 0' }}>(An OTP will be sent to your email for verification)</p>
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
                {isOtpSent && (
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
    )
}

export default Register;
