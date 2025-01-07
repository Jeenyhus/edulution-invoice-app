import api from './api';

class DepartmentService {
  async getDepartments() {
    const response = await api.get('/api/departments');
    return response.data;
  }

  async addDepartment(name) {
    const response = await api.post('/api/departments', { name });
    return response.data;
  }

  async updateDepartment(id, data) {
    const response = await api.put(`/api/departments/${id}`, data);
    return response.data;
  }

  async deleteDepartment(id) {
    const response = await api.delete(`/api/departments/${id}`);
    return response.data;
  }

  async addCareer(departmentId, name) {
    const response = await api.post(`/api/departments/${departmentId}/careers`, { name });
    return response.data;
  }

  async deleteCareer(departmentId, careerId) {
    const response = await api.delete(`/api/departments/${departmentId}/careers/${careerId}`);
    return response.data;
  }
}

export const departmentService = new DepartmentService(); 