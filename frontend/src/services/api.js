import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for debugging
api.interceptors.request.use(request => {
  // Don't add auth header for register and login routes
  if (!request.url.includes('/auth/')) {
    const token = localStorage.getItem('token');
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }
  }
  console.log('Starting Request:', {
    url: request.url,
    method: request.method,
    data: request.data
  });
  return request;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  response => {
    console.log('Response:', response.data);
    return response;
  },
  error => {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

// Auth service
export const authService = {
  register: async (userData) => {
    console.log('Registering user:', userData);
    try {
      const response = await api.post('/auth/register', userData);
      return response;
    } catch (error) {
      console.error('Registration error in service:', error);
      throw error;
    }
  },
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout')
};

// Task service
export const taskService = {
  getTasks: () => api.get('/tasks'),
  createTask: (data) => api.post('/tasks', data),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`)
};

// User service
export const userService = {
  getUsers: () => api.get('/users'),
  createUser: (data) => api.post('/users', data),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`)
};

// Invoice service
export const invoiceService = {
  generateInvoice: (userId, startDate, endDate) => 
    api.get(`/invoices/${userId}`, {
      params: { startDate, endDate },
      responseType: 'blob'
    })
};

export default api;