import { useState, useEffect } from 'react';
import { taskService } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const [recentTasks, setRecentTasks] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await taskService.getTasks();
        const tasks = response.data;
        
        // Sort tasks by date (most recent first) and take the last 5
        const sortedTasks = tasks.sort((a, b) => new Date(b.date) - new Date(a.date));
        setRecentTasks(sortedTasks.slice(0, 5));
        
        // Calculate total hours for the current user's tasks
        const total = tasks.reduce((acc, task) => acc + task.hoursWorked, 0);
        setTotalHours(total);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8 md:px-8 md:py-10">
            <h1 className="text-2xl font-bold text-white mb-2">
              Welcome back, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-gray-300">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-600">Tasks This Month</p>
              <span className="p-2 bg-gray-50 rounded-lg">
                <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{recentTasks.length}</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-600">Total Hours</p>
              <span className="p-2 bg-gray-50 rounded-lg">
                <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalHours}</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-600">Earnings</p>
              <span className="p-2 bg-gray-50 rounded-lg">
                <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900">${(totalHours * (user?.hourlyRate || 0)).toFixed(2)}</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Tasks Card */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                Recent Tasks
                <span className="ml-2 px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                  Last 5
                </span>
              </h2>
            </div>
            <div className="p-6">
              <div className="divide-y divide-gray-100">
                {recentTasks.map((task) => (
                  <div key={task.id} className="py-4 first:pt-0 last:pb-0 hover:bg-gray-50 transition-colors duration-200 rounded-lg p-2">
                    <p className="font-medium text-gray-900 mb-2">{task.description}</p>
                    <div className="flex items-center text-sm text-gray-600 space-x-4">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(task.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {task.hoursWorked} hours
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Card */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Activity</h2>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="space-y-4">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gray-900 rounded-full transition-all duration-500" 
                      style={{ width: `${(totalHours/160) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Monthly Progress</span>
                    <span className="font-medium text-gray-900">{((totalHours/160) * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 