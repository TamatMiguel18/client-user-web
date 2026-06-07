import axios from 'axios';

// Use env variable, but if it incorrectly includes /user at the end, replace it.
let baseURL = import.meta.env.VITE_USER_URL || 'http://localhost:3002/smartgrowgt/v1';
baseURL = baseURL.replace(/\/user\/?$/, '');

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for responses to simplify error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error.response?.data || error);
  }
);

// export const getUsuarios = () => api.get('/'); 
export const getUserById = (id) => api.get(`/usuarios/${id}`); // GET /smartgrowgt/v1/usuarios/:id
export const saveUsuario = (data) => api.post('/usuarios/create', data); // POST /smartgrowgt/v1/usuarios/create
export const updateUsuario = (id, data) => api.put(`/usuarios/update/${id}`, data);
export const deactivateUsuario = (id) => api.patch(`/usuarios/deactivate/${id}`);

export default api;
