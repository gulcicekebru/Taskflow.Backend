import axios from "../api/axios";

const AuthService = {
    register: (username, password) => {
        return axios.post("/Auth/register", { username, password });
    },
    login: (username, password) => {
        return axios.post("/Auth/login", { username, password });
    },
    logout: () => {
        localStorage.removeItem("token");
    },
    saveToken: (token) => {
        localStorage.setItem("token", token);
    },
    getToken: () => {
        return localStorage.getItem("token");
    }
};

export default AuthService;
