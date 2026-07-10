import axios from 'axios';

// Usar VITE_AUTH_URL o default si no existe
const baseURL = import.meta.env.VITE_AUTH_URL || 'http://localhost:5109';

const axiosAuth = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar el token
axiosAuth.interceptors.request.use(
    (config) => {
        const authData = localStorage.getItem('user-auth-storage');
        if (authData) {
            try {
                const parsed = JSON.parse(authData);
                const token = parsed?.state?.token;
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (e) {
                // Ignore parse errors
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor for responses to simplify error handling
axiosAuth.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);

// =======================
// AUTHENTICATION
// =======================

export const login = async (data) => {
    return await axiosAuth.post('/api/v1/auth/login', data);
};

export const registerAgricultor = async (data) => {
    // Expected to be FormData since endpoint consumes multipart/form-data
    return await axiosAuth.post('/api/v1/auth/register', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const forgotPassword = async (email) => {
    return await axiosAuth.post('/api/v1/auth/forgot-password', { email });
};

export const resetPassword = async (data) => {
    return await axiosAuth.post('/api/v1/auth/reset-password', data);
};

export const verifyEmail = async (token) => {
    return await axiosAuth.post('/api/v1/auth/verify-email', { token });
};

export const resendVerification = async (email) => {
    return await axiosAuth.post('/api/v1/auth/resend-verification', { email });
};

export const getProfile = async () => {
    return await axiosAuth.get('/api/v1/auth/profile');
};
