import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://localhost:7286/api',  // kendi .NET backend'inin adresini yaz
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("token")}`
    },
});

export default axiosInstance;
