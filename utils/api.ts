import axios from 'axios';

const api = axios.create({
    baseURL: 'https://task-backend-jade.vercel.app/api',
    withCredentials: true,
});

export default api;
