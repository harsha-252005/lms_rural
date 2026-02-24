import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // Uses Vite proxy in development
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
