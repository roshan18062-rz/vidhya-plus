import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://vidhyaplus-api.onrender.com/api';

// FIX #6: no more Authorization header built from a localStorage token — the
// browser now sends the httpOnly 'token' cookie automatically. withCredentials
// is required for the browser to include cookies on cross-origin requests.
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// FIX #14: read the (non-httpOnly) CSRF cookie the server sets and echo it back
// as a header on state-changing requests, per the double-submit pattern.
function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

api.interceptors.request.use(
  (config) => {
    if (['post', 'put', 'delete'].includes(config.method)) {
      const csrfToken = getCookie('csrfToken');
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
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
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout') // FIX #9: invalidates token server-side too
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