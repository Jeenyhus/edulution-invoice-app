import { useState, useEffect } from 'react';
import { taskService } from '../services/api';
import { userService } from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';
import TaskForm from '../components/TaskForm';

const truncateDescription = (description, maxLength = 35) => {
  if (!description) return '';
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength) + '...';
};

function Dashboard() {
  const [recentTasks, setRecentTasks] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  const [userData, setUserData] = useState(null);
  const [taskStats, setTaskStats] = useState({
    totalTasks: 0,
    thisWeekTasks: 0
  });
  const navigate = useNavigate();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const location = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [tasksResponse, profileResponse] = await Promise.all([
        taskService.getTasks(),
        userService.getProfile()
      ]);
      
      const tasks = tasksResponse.data;
      setUserData(profileResponse.data);
      
      // Sort tasks by date (most recent first) and take the last 5
      const sortedTasks = tasks.sort((a, b) => new Date(b.date) - new Date(a.date));
      setRecentTasks(sortedTasks.slice(0, 5));
      
      // Calculate total hours for all tasks
      const total = tasks.reduce((acc, task) => {
        const hours = parseFloat(task.hoursWorked);
        return acc + (isNaN(hours) ? 0 : hours);
      }, 0);
      
      setTotalHours(Math.round(total * 100) / 100);

      // Calculate task statistics
      const now = new Date();
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      startOfWeek.setHours(0, 0, 0, 0);

      setTaskStats({
        totalTasks: tasks.length,
        thisWeekTasks: tasks.filter(task => new Date(task.date) >= startOfWeek).length
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (location.state?.showSuccessMessage) {
      setShowSuccess(true);
      // Hide the message after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  // Get time of day for greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 17) return "afternoon";
    return "evening";
  };

  // Get motivational quote
  const getMotivationalQuote = () => {
    const quotes = [
      "Making a difference, one task at a time.",
      "Your dedication shapes the future of education.",
      "Every hour you contribute creates lasting impact.",
      "Transforming lives through your valuable work.",
      "Your work empowers the next generation."
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  const handleQuickAction = (action) => {
    switch(action) {
      case 'new-task':
        setIsTaskFormOpen(true);
        break;
      case 'view-tasks':
        navigate('/tasks');
        break;
      case 'profile':
        navigate('/profile');
        break;
      default:
        break;
    }
  };

  const handleCreateTask = async (formData) => {
    try {
      await taskService.createTask(formData);
      setIsTaskFormOpen(false);
      fetchDashboardData();
      window.dispatchEvent(new Event('taskCreated'));
    } catch (error) {
      console.error('Error creating task:', error);
      const errorMessage = error.response?.data?.message || 'Error creating task';
      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Section with Greeting and Visual Element */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="relative p-8">
            <div className="max-w-3xl relative z-10">
              <h1 className="text-3xl font-bold text-[#0072cd] mb-2">
                Good {getTimeBasedGreeting()}, {userData?.name?.split(' ')[0]} 👋
              </h1>
              <p className="text-gray-600 text-lg mb-4">
                {getMotivationalQuote()}
              </p>
              <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
            {/* Abstract Pattern Background */}
            <div className="absolute top-0 right-0 w-1/3 h-full opacity-5">
              <div className="w-full h-full grid grid-cols-3 gap-2">
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Tasks Card */}
          <div onClick={() => handleQuickAction('view-tasks')} 
               className="group bg-white rounded-2xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gray-100 rounded-xl group-hover:bg-gray-200 transition-colors">
                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{taskStats.totalTasks}</p>
              </div>
            </div>
          </div>

          {/* This Week's Tasks Card */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gray-100 rounded-xl">
                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">This Week</p>
                <p className="text-2xl font-bold text-gray-900">{taskStats.thisWeekTasks}</p>
              </div>
            </div>
          </div>

          {/* Total Hours Card */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gray-100 rounded-xl">
                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Hours</p>
                <p className="text-2xl font-bold text-gray-900">{totalHours}h</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Tasks Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>
                <button 
                  onClick={() => handleQuickAction('view-tasks')}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  View all
                </button>
              </div>
              <div className="space-y-4">
                {recentTasks.map((task, index) => (
                  <div 
                    key={index} 
                    className="group flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 cursor-pointer"
                    onClick={() => navigate(`/tasks/${task.id}`)}
                  >
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900 group-hover:text-black">{task.description}</h3>
                      <p className="text-sm text-gray-500">{new Date(task.date).toLocaleDateString()}</p>
                    </div>
                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-200 text-gray-900">
                      {task.hoursWorked}h
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-2xl shadow-sm">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <button 
                  onClick={() => handleQuickAction('new-task')}
                  className="w-full flex items-center justify-between p-4 bg-[#0072cd]/10 rounded-xl text-[#0072cd] hover:bg-[#0072cd]/20 transition-all duration-300"
                >
                  <span className="text-sm font-medium">Create New Task</span>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <button 
                  onClick={() => handleQuickAction('profile')}
                  className="w-full flex items-center justify-between p-4 bg-gray-100 rounded-xl text-gray-900 hover:bg-gray-200 transition-all duration-300"
                >
                  <span className="text-sm font-medium">View Profile</span>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal with TaskForm */}
      {isTaskFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create New Task</h2>
              <button 
                onClick={() => setIsTaskFormOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <TaskForm onSubmit={handleCreateTask} onClose={() => setIsTaskFormOpen(false)} />
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-50 p-4 rounded-md shadow-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Successfully logged in!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard; 