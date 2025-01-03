import { useState, useEffect } from 'react';
import taskService from '../services/taskService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TaskForm from '../components/TaskForm';
import ConfirmationModal from '../components/ConfirmationModal';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await taskService.getTasks();
        setTasks(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch tasks');
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCreateTask = async (formData) => {
    try {
      const newTask = await taskService.createTask(formData);
      setTasks([...tasks, newTask]);
      setIsModalOpen(false);
      toast.success('Task created successfully');
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const handleUpdateTask = async (formData) => {
    try {
      await taskService.updateTask(editingTask.id, formData);
      setTasks(tasks.map(task => 
        task.id === editingTask.id ? { ...task, ...formData } : task
      ));
      setIsModalOpen(false);
      setEditingTask(null);
      toast.success('Task updated successfully');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;
    
    try {
      await taskService.deleteTask(taskToDelete.id);
      setTasks(tasks.filter(t => t.id !== taskToDelete.id));
      setShowDeleteModal(false);
      setTaskToDelete(null);
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const handleDelete = (task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0072cd]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-4 rounded-lg bg-white text-gray-900 flex items-center border border-gray-200 shadow-sm">
          <svg className="w-6 h-6 mr-2 text-[#0072cd]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="relative p-8">
            <div className="max-w-3xl relative z-10">
              <h1 className="text-3xl font-bold text-[#0072cd] mb-2">
                Task Management
              </h1>
              <p className="text-gray-600 text-lg mb-4">
                Track and manage your tasks efficiently
              </p>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 bg-[#0072cd] text-white rounded-lg hover:bg-[#0072cd]/90 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Create New Task
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[#0072cd]/10 rounded-xl">
                <svg className="w-6 h-6 text-[#0072cd]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Tasks</p>
                <p className="text-2xl font-bold text-[#0072cd]">{tasks.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">All Tasks</h2>
              <div className="flex items-center space-x-4">
                {/* Add filters/search if needed */}
              </div>
            </div>
            
            <div className="space-y-4">
              {tasks.map((task) => (
                <div 
                  key={task.id}
                  className="group flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300"
                >
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-500">{new Date(task.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-[#0072cd]/10 text-[#0072cd]">
                      {task.hoursWorked}h
                    </span>
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(task)}
                        className="p-2 text-gray-500 hover:text-[#0072cd] transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(task)}
                        className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {(isModalOpen || editingTask) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h2>
            </div>
            <div className="p-6">
              <TaskForm
                onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                initialData={editingTask}
              />
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingTask(null);
                }}
                className="mt-4 px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        message={`Are you sure you want to delete "${taskToDelete?.description}"?`}
      />
    </div>
  );
}

export default Tasks; 