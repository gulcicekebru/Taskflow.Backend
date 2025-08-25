import React, { useState } from "react";
import AuthService from "../services/AuthService";
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleGoToRegister = () => {
        navigate('/register');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            if (isLogin) {
                const res = await AuthService.login(username, password);
                AuthService.saveToken(res.data.token);
                setMessage("✅ Login is successfull! Token saved.");
                setIsLogin(true);
                navigate('/tasks'); 
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
            <h2>{"Login"}</h2>
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
                    {"Login"}
                </button>
            </form>
            <p style={{ marginTop: "10px", cursor: "pointer", color: "blue" }}
                onClick={ handleGoToRegister }>
                {isLogin ? "You don't have an account? Register" : "You have an account? Login"}
            </p>
            {message && <p style={{ marginTop: "10px" }}>{message}</p>}
        </div>
    );
};

export default LoginPage;
