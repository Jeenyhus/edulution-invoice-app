import { useState, useEffect } from 'react';
import { taskService } from '../services/api';
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
  const [shifts, setShifts] = useState({
    morning: false,
    afternoon: false
  });

  const fetchTasks = async () => {
    try {
      const response = await taskService.getTasks();
      setTasks(response.data);
      
      const today = new Date().toISOString().split('T')[0];
      const todaysTasks = response.data.filter(task => task.date === today);
      
      setShifts({
        morning: todaysTasks.some(task => task.shift === 'morning'),
        afternoon: todaysTasks.some(task => task.shift === 'afternoon')
      });
      
      // Dispatch event to update Profile stats
      window.dispatchEvent(new Event('taskUpdated'));
      setError(null);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (formData) => {
    try {
      const response = await taskService.createTask(formData);
      setIsModalOpen(false);
      await fetchTasks();
      window.dispatchEvent(new Event('taskCreated'));
      setError(null);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error creating task';
      setError(errorMessage);
      
      if (errorMessage.includes('shift')) {
        alert(errorMessage);
        setIsModalOpen(false);
      }
      
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleUpdateTask = async (formData) => {
    try {
      await taskService.updateTask(editingTask.id, formData);
      setEditingTask(null);
      await fetchTasks();
      window.dispatchEvent(new Event('taskUpdated'));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await taskService.deleteTask(taskToDelete.id);
      setTasks(tasks.filter(task => task.id !== taskToDelete.id));
      window.dispatchEvent(new Event('taskDeleted'));
      setError(null);
      setShowDeleteModal(false);
      setTaskToDelete(null);
    } catch (error) {
      setError('Failed to delete task: ' + error.message);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="p-4 rounded-lg text-gray-900 flex items-center border border-gray-200">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8 md:px-8 md:py-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-white">
              <h2 className="text-2xl font-bold mb-2">Track Your Progress</h2>
              <p className="text-gray-300">
                Recording your tasks helps you stay organized and measure your growth.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center bg-white/10 rounded-lg p-6 text-white">
              <div className="text-4xl font-bold mb-1">{tasks.length}</div>
              <div className="text-sm text-gray-300">Total Tasks</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <h1 className="text-3xl font-bold text-gray-900">Tasks Overview</h1>
          <button
            onClick={() => {
              if (shifts.morning && shifts.afternoon) {
                alert('You have already recorded tasks for both shifts today.');
                return;
              }
              setIsModalOpen(true);
            }}
            className={`inline-flex items-center px-6 py-3 text-sm font-medium rounded-lg text-white ${
              shifts.morning && shifts.afternoon 
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gray-900 hover:bg-gray-800 transition-colors duration-200'
            }`}
            disabled={shifts.morning && shifts.afternoon}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Task
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg border border-gray-100">
          <ul className="divide-y divide-gray-100">
            {tasks.map((task) => (
              <li key={task.id} className="group hover:bg-gray-50 transition-all duration-200">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div className="flex-1">
                      <p className="text-lg font-semibold text-gray-900 mb-2">{task.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(task.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {task.startTime} - {task.endTime}
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          {task.hoursWorked} hours
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-900 border border-gray-200">
                          {task.shift} shift
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setEditingTask(task)}
                        className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(task)}
                        className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
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
    </div>
  );
}

export default Tasks; 