import axios from 'axios';

// Set base URL based on environment
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: baseURL
});

export default api;
