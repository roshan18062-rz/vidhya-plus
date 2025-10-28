import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://vidhyaplus-api.onrender.com/api';
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me')
};

// Students API
export const studentsAPI = {
  getAll: (params) => api.get('/students', { params }),
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
  getStats: () => api.get('/students/stats/dashboard')
};

// Attendance API
export const attendanceAPI = {
  mark: (data) => api.post('/attendance', data),
  bulkMark: (data) => api.post('/attendance/bulk', data),
  getAll: (params) => api.get('/attendance', { params }),
  getToday: () => api.get('/attendance/today')
};

// Fees API
export const feesAPI = {
  create: (data) => api.post('/fees', data),
  getAll: (params) => api.get('/fees', { params }),
  getPending: () => api.get('/fees/pending'),
  getStats: () => api.get('/fees/stats')
};

export default api;