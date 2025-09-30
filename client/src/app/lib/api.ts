import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// IMPORTANT: Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // This function will run before every request is sent
    const token = localStorage.getItem('token');
    if (token) {
      // If the token exists, add it to the Authorization header
      // It's common to use 'Bearer' as the scheme, but our backend expects 'x-auth-token'
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    // This function will run if there's an error setting up the request
    return Promise.reject(error);
  }
);

export default api;