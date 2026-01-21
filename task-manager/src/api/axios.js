import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5047/api',  // kendi .NET backend'inin adresini yaz
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("token")}`
    },
});

export default axiosInstance;
