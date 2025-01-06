import api from '../api';

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData)
};

export const userService = {
  getUsers: () => api.get('/users'),
  updateProfile: (data) => api.put('/users/profile', data),
  deleteUser: (id) => api.delete(`/users/${id}`)
};

export const taskService = {
  getTasks: () => api.get('/tasks'),
  createTask: (data) => api.post('/tasks', data),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`)
};

export const departmentService = {
  getDepartments: () => api.get('/departments'),
  updateDepartment: (id, data) => api.put(`/departments/${id}`, data),
  deleteDepartment: (id) => api.delete(`/departments/${id}`),
  addCareer: (deptId, careerName) => api.post(`/departments/${deptId}/careers`, { name: careerName }),
  deleteCareer: (deptId, careerId) => api.delete(`/departments/${deptId}/careers/${careerId}`)
};

export const invoiceService = {
  getInvoices: () => api.get('/invoices'),
  createInvoice: (data) => api.post('/invoices', data),
  updateInvoice: (id, data) => api.put(`/invoices/${id}`, data),
  deleteInvoice: (id) => api.delete(`/invoices/${id}`)
};

export default api; 