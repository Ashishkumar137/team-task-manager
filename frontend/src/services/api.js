import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? "http://localhost:5000/api" : "https://team-task-manager-production-550f.up.railway.app/api");
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  signup: (data) => apiClient.post('/auth/signup', data),
  login: (data) => apiClient.post('/auth/login', data),
  getMe: () => apiClient.get('/auth/me'),
};

export const projectService = {
  getAll: (params) => apiClient.get('/projects', { params }),
  getById: (id) => apiClient.get(`/projects/${id}`),
  create: (data) => apiClient.post('/projects', data),
  update: (id, data) => apiClient.put(`/projects/${id}`, data),
  delete: (id) => apiClient.delete(`/projects/${id}`),
};

export const taskService = {
  getByProject: (projectId, params) => apiClient.get(`/projects/${projectId}/tasks`, { params }),
  getMyTasks: (params) => apiClient.get('/my-tasks', { params }),
  getById: (id) => apiClient.get(`/tasks/${id}`),
  create: (projectId, data) => apiClient.post(`/projects/${projectId}/tasks`, data),
  update: (id, data) => apiClient.put(`/tasks/${id}`, data),
  delete: (id) => apiClient.delete(`/tasks/${id}`),
};

export const teamService = {
  getMembers: (projectId) => apiClient.get(`/projects/${projectId}/members`),
  addMember: (projectId, data) => apiClient.post(`/projects/${projectId}/members`, data),
  updateRole: (projectId, userId, data) => apiClient.put(`/projects/${projectId}/members/${userId}`, data),
  removeMember: (projectId, userId) => apiClient.delete(`/projects/${projectId}/members/${userId}`),
};

export default apiClient;
