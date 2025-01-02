import { useState, useEffect } from 'react';
import { taskService } from '../services/api';
import TaskForm from '../components/TaskForm';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      const response = await taskService.getTasks();
      setTasks(response.data);
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
      await taskService.createTask(formData);
      setIsModalOpen(false);
      await fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (formData) => {
    try {
      await taskService.updateTask(editingTask.id, formData);
      setEditingTask(null);
      await fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(taskId);
        await fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-50 p-4 rounded-lg text-red-800 flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-black rounded-2xl shadow-xl overflow-hidden transform transition-all hover:shadow-2xl">
          <div className="px-6 py-8 md:px-8 md:py-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-white">
              <h2 className="text-2xl font-bold mb-2">Track Your Progress 🚀</h2>
              <p className="text-gray-300 leading-relaxed">
                Recording your tasks helps you stay organized and measure your growth. 
                Keep track of your work hours and watch your productivity soar!
              </p>
            </div>
            <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white border border-white/10 shadow-lg">
              <div className="text-4xl font-bold mb-1">{tasks.length}</div>
              <div className="text-sm text-gray-300">Total Tasks</div>
            </div>
          </div>
          <div className="px-6 py-4 bg-white/5 backdrop-blur-sm flex flex-wrap gap-6">
            <div className="flex items-center text-gray-300 hover:text-white transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Stay consistent
            </div>
            <div className="flex items-center text-gray-300 hover:text-white transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Build good habits
            </div>
            <div className="flex items-center text-gray-300 hover:text-white transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Track earnings
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <h1 className="text-3xl font-bold text-gray-900">
            Tasks Overview
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="group relative inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-full text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Task
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
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
                        className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-full text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                      >
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-100">
              <div className="p-6 border-b border-gray-100 bg-gray-50">
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
                  className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Tasks; 