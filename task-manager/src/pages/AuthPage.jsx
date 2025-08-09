import React, { useState } from "react";
import AuthService from "../services/AuthService";

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            if (isLogin) {
                const res = await AuthService.login(username, password);
                AuthService.saveToken(res.data.token);
                setMessage("✅ Login is successfull! Token saved.");
            } else {
                await AuthService.register(username, password);
                setMessage("✅ Register is successfull! Now you can login.");
                setIsLogin(true);
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
            <h2>{isLogin ? "Login" : "Register"}</h2>
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
                    {isLogin ? "Login" : "Register"}
                </button>
            </form>
            <p style={{ marginTop: "10px", cursor: "pointer", color: "blue" }}
                onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "You don't have an account? Register" : "You have an account? Login"}
            </p>
            {message && <p style={{ marginTop: "10px" }}>{message}</p>}
        </div>
    );
};

export default AuthPage;
