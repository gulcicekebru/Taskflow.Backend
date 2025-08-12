import React, { useState } from "react";
import AuthService from "../services/AuthService";
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [isRegister, setIsRegister] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleGoToLogin = () => {
        navigate('/login');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            if (isRegister) {
                const res = await AuthService.register(username, password);
                setMessage("✅ Register is successfull! Now you can login.");
                setIsRegister(true);
                navigate('/login')
            }
        } catch (err) {
            console.error(err);
            setMessage("❌ Error: " + (err.response?.data || "Does not connect to server!"));
        }
    };

    return (
        <div style={{
            maxWidth: "400px", margin: "50px auto", padding: "20px",
            border: "1px solid #ccc", borderRadius: "10px"
        }}>
            <h2>{"Register"}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{ width: "95%", padding: "10px", marginBottom: "10px" }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ width: "95%", padding: "10px", marginBottom: "10px" }}
                />
                <button
                    type="submit"
                    style={{
                        width: "100%",
                        padding: "10px",
                        background: "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: "5px"
                    }}
                >
                    {"Register"}
                </button>
            </form>
            <p style={{ marginTop: "10px", cursor: "pointer", color: "blue" }}
                onClick={handleGoToLogin}>
                {"You have an account? Login"}
            </p>
            {message && <p style={{ marginTop: "10px" }}>{message}</p>}
        </div>
    );
};

export default RegisterPage;
