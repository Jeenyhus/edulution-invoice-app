import axios from 'axios';

const getDepartments = () => {
  return axios.get('/api/departments');
};

const addDepartment = (name) => {
  return axios.post('/api/departments', { name }, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
};

const addCareer = (departmentId, name) => {
  return axios.post(`/api/departments/${departmentId}/careers`, { name }, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
};

export const departmentService = {
  getDepartments,
  addDepartment,
  addCareer
};

export default departmentService; 