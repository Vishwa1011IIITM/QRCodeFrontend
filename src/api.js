import axios from 'axios';

const api = axios.create({
    baseURL: 'https://qrcodebackend-c4if.onrender.com',
    headers: { 'Content-Type': 'application/json' },
});

export default api;
