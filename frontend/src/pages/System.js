import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { departmentService } from '../services';

function System() {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isAddingDepartment, setIsAddingDepartment] = useState(false);
  const [isAddingCareer, setIsAddingCareer] = useState(false);
  const [isEditingDepartment, setIsEditingDepartment] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [newCareerName, setNewCareerName] = useState('');

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await departmentService.getDepartments();
      console.log('Departments response:', response.data);
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('Failed to fetch departments');
    }
  };

  const handleAddDepartment = async () => {
    try {
      await departmentService.addDepartment(newDepartmentName);
      setNewDepartmentName('');
      setIsAddingDepartment(false);
      fetchDepartments();
      toast.success('Department added successfully');
    } catch (error) {
      toast.error('Failed to add department');
    }
  };

  const handleEditDepartment = async () => {
    try {
      await departmentService.updateDepartment(selectedDepartment.id, {
        name: newDepartmentName
      });
      setNewDepartmentName('');
      setIsEditingDepartment(false);
      fetchDepartments();
      toast.success('Department updated successfully');
    } catch (error) {
      toast.error('Failed to update department');
    }
  };

  const handleDeleteDepartment = async (departmentId) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await departmentService.deleteDepartment(departmentId);
        fetchDepartments();
        setSelectedDepartment(null);
        toast.success('Department deleted successfully');
      } catch (error) {
        toast.error('Failed to delete department');
      }
    }
  };

  const handleAddCareer = async () => {
    try {
      await departmentService.addCareer(selectedDepartment.id, newCareerName);
      setNewCareerName('');
      setIsAddingCareer(false);
      fetchDepartments();
      toast.success('Career added successfully');
    } catch (error) {
      toast.error('Failed to add career');
    }
  };

  const handleDeleteCareer = async (careerId) => {
    if (window.confirm('Are you sure you want to delete this career?')) {
      try {
        await departmentService.deleteCareer(selectedDepartment.id, careerId);
        fetchDepartments();
        toast.success('Career deleted successfully');
      } catch (error) {
        toast.error('Failed to delete career');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Department & Career Management
            </h1>
            <button
              onClick={() => setIsAddingDepartment(true)}
              className="bg-primary-DEFAULT hover:bg-primary-dark text-white px-4 py-2 rounded-lg"
            >
              Add Department
            </button>
          </div>

          {/* Add/Edit Department Form */}
          {(isAddingDepartment || isEditingDepartment) && (
            <div className="mb-6 p-4 border rounded-lg">
              <input
                type="text"
                value={newDepartmentName}
                onChange={(e) => setNewDepartmentName(e.target.value)}
                placeholder="Department Name"
                className="w-full p-2 border rounded mb-2 dark:bg-gray-700 dark:text-white"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setIsAddingDepartment(false);
                    setIsEditingDepartment(false);
                    setNewDepartmentName('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={isEditingDepartment ? handleEditDepartment : handleAddDepartment}
                  className="px-4 py-2 bg-primary-DEFAULT text-white rounded hover:bg-primary-dark"
                >
                  {isEditingDepartment ? 'Update' : 'Save'}
                </button>
              </div>
            </div>
          )}

          {/* Departments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {departments.map(department => (
              <div
                key={department.id}
                className={`p-4 border rounded-lg cursor-pointer ${
                  selectedDepartment?.id === department.id
                    ? 'border-primary-DEFAULT'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
                onClick={() => setSelectedDepartment(department)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {department.name}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEditingDepartment(true);
                        setNewDepartmentName(department.name);
                        setSelectedDepartment(department);
                      }}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDepartment(department.id);
                      }}
                      className="text-red-600 hover:text-red-800 dark:text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {department.careers?.length || 0} careers
                </div>
              </div>
            ))}
          </div>

          {/* Careers Section */}
          {selectedDepartment && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium text-gray-900 dark:text-white">
                  Careers in {selectedDepartment.name}
                </h2>
                <button
                  onClick={() => setIsAddingCareer(true)}
                  className="bg-primary-DEFAULT hover:bg-primary-dark text-white px-4 py-2 rounded-lg"
                >
                  Add Career
                </button>
              </div>

              {/* Add Career Form */}
              {isAddingCareer && (
                <div className="mb-6 p-4 border rounded-lg">
                  <input
                    type="text"
                    value={newCareerName}
                    onChange={(e) => setNewCareerName(e.target.value)}
                    placeholder="Career Name"
                    className="w-full p-2 border rounded mb-2 dark:bg-gray-700 dark:text-white"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        setIsAddingCareer(false);
                        setNewCareerName('');
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddCareer}
                      className="px-4 py-2 bg-primary-DEFAULT text-white rounded hover:bg-primary-dark"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}

              {/* Careers List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedDepartment.careers?.map(career => (
                  <div key={career.id} className="p-4 border rounded-lg dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {career.name}
                      </h4>
                      <button
                        onClick={() => handleDeleteCareer(career.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default System; 