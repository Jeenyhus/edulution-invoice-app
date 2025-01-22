import { useState, useEffect, useCallback } from 'react';
import { taskService, userService } from '../services';
import { useNavigate, useLocation } from 'react-router-dom';
import TaskForm from '../components/TaskForm';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { calculateEarnings } from '../utils/calculations';
import { useAuth } from '../contexts/AuthContext';
import { setAuthToken } from '../services/api';

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  const [taskStats, setTaskStats] = useState({
    totalTasks: 0,
    thisWeekTasks: 0
  });
  const navigate = useNavigate();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const location = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalHours: 0,
    totalEarnings: 0,
    monthlyHours: 0,
    monthlyEarnings: 0
  });
  const { user } = useAuth();

  const calculateDashboardStats = useCallback((tasks, hourlyRate) => {
    // Convert empty string or invalid hourly rate to 0
    const validHourlyRate = parseFloat(hourlyRate) || 0;
    if (validHourlyRate <= 0) {
      toast.error('Please set a valid hourly rate in your profile');
      return {
        totalHours: 0,
        totalEarnings: 0,
        monthlyHours: 0,
        monthlyEarnings: 0
      };
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const monthlyTasks = tasks.filter(task => new Date(task.date) >= startOfMonth);
    
    const totalHours = tasks.reduce((acc, task) => acc + (parseFloat(task.hoursWorked) || 0), 0);
    const monthlyHours = monthlyTasks.reduce((acc, task) => acc + (parseFloat(task.hoursWorked) || 0), 0);
    
    return {
      totalHours: Math.round(totalHours * 100) / 100,
      totalEarnings: calculateEarnings(totalHours, validHourlyRate),
      monthlyHours: Math.round(monthlyHours * 100) / 100,
      monthlyEarnings: calculateEarnings(monthlyHours, validHourlyRate)
    };
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [tasks, profile] = await Promise.all([
        taskService.getTasks(),
        userService.getProfile()
      ]);
      
      console.log('Profile data:', profile);
      console.log('Tasks data:', tasks);
      console.log('Hourly rate:', profile.hourlyRate);
      
      setUserData(profile);
      
      // Calculate dashboard stats
      const stats = calculateDashboardStats(tasks, profile.hourlyRate);
      console.log('Calculated stats:', stats);
      setDashboardStats(stats);
      setTotalHours(stats.totalHours);
      
      // Sort tasks by date (most recent first) and take the last 5
      const sortedTasks = tasks.sort((a, b) => new Date(b.date) - new Date(a.date));
      setRecentTasks(sortedTasks.slice(0, 5));
      
      // Calculate task statistics
      const now = new Date();
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      startOfWeek.setHours(0, 0, 0, 0);

      const thisWeekTasks = tasks.filter(task => new Date(task.date) >= startOfWeek);
      const thisWeekHours = thisWeekTasks.reduce((acc, task) => acc + (parseFloat(task.hoursWorked) || 0), 0);

      setTaskStats({
        totalTasks: tasks.length,
        thisWeekTasks: Math.round(thisWeekHours * 100) / 100
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [calculateDashboardStats]);

  useEffect(() => {
    // Set the auth token when the component mounts
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    }
    fetchData();
  }, [fetchData]);

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

  useEffect(() => {
    const handleProfileUpdate = () => {
      fetchData();
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, [fetchData]);

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

  const handleCreateTask = async (taskData) => {
    try {
      const response = await taskService.createTask(taskData);
      
      if (response.data) {
        // Update dashboard data
        await fetchData();
        
        // Close form and show success message
        setIsTaskFormOpen(false);
        toast.success('Task created successfully');
        
        // Dispatch custom event for other components
        window.dispatchEvent(new Event('taskCreated'));
      }
    } catch (error) {
      console.error('Error creating task:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create task';
      toast.error(errorMessage);
      
      // Keep form open if there's an error
      setIsTaskFormOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="relative p-8">
            <div className="max-w-3xl relative z-10">
              <h1 className="text-3xl font-bold text-primary-DEFAULT mb-2">
                Good {getTimeBasedGreeting()}, {userData?.name?.split(' ')[0]} 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">
                {getMotivationalQuote()}
              </p>
              <div className="inline-flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
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
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary-DEFAULT/10 dark:bg-primary-DEFAULT/20 rounded-xl">
                <svg className="w-6 h-6 text-primary-DEFAULT" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{taskStats.totalTasks}</p>
              </div>
            </div>
          </div>

          {/* Hours This Week Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary-DEFAULT/10 dark:bg-primary-DEFAULT/20 rounded-xl">
                <svg className="w-6 h-6 text-primary-DEFAULT" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Hours This Week</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{taskStats.thisWeekTasks}h</p>
              </div>
            </div>
          </div>

          {/* Monthly Earnings Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary-DEFAULT/10 dark:bg-primary-DEFAULT/20 rounded-xl">
                <svg className="w-6 h-6 text-primary-DEFAULT" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Earnings</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">ZMW {dashboardStats.monthlyEarnings.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Tasks Card */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Tasks</h2>
                <button 
                  onClick={() => handleQuickAction('view-tasks')}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  View all
                </button>
              </div>
              <div className="space-y-4">
                {recentTasks.map((task, index) => (
                  <div 
                    key={index} 
                    className="group flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-black dark:group-hover:text-white">{task.description}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(task.date).toLocaleDateString()}</p>
                    </div>
                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white">
                      {task.hoursWorked}h
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <button 
                  onClick={() => handleQuickAction('new-task')}
                  className="w-full flex items-center justify-between p-4 bg-primary-DEFAULT/10 dark:bg-primary-DEFAULT/20 rounded-xl text-primary-DEFAULT hover:bg-primary-DEFAULT/20 dark:hover:bg-primary-DEFAULT/30 transition-all duration-300"
                >
                  <span className="text-sm font-medium">Create New Task</span>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <button 
                  onClick={() => handleQuickAction('profile')}
                  className="w-full flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Task</h2>
              <button 
                onClick={() => setIsTaskFormOpen(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
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
        <div className="fixed top-4 right-4 bg-green-50 dark:bg-green-900/30 p-4 rounded-md shadow-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400 dark:text-green-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
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