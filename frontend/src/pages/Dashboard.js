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
        setRecentTasks(tasks.slice(0, 5)); // Get last 5 tasks
        
        // Calculate total hours
        const total = tasks.reduce((acc, task) => acc + task.hoursWorked, 0);
        setTotalHours(total);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Welcome back, {user?.name}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Tasks Card */}
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
          <div className="border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50 p-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Recent Tasks
            </h2>
          </div>
          <div className="p-6">
            <div className="divide-y divide-gray-100">
              {recentTasks.map((task) => (
                <div key={task.id} className="py-4 first:pt-0 last:pb-0 hover:bg-gray-50 transition-colors duration-150 rounded-lg p-2">
                  <p className="font-medium text-gray-800 mb-1">{task.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(task.date).toLocaleDateString()}
                    <span className="mx-2">•</span>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {task.hoursWorked} hours
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
          <div className="border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50 p-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Summary
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
              <p className="text-sm font-medium text-gray-600 mb-2">Total Hours This Month</p>
              <p className="text-3xl font-bold text-gray-900">{totalHours}</p>
            </div>
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6">
              <p className="text-sm font-medium text-gray-600 mb-2">Estimated Earnings</p>
              <p className="text-3xl font-bold text-emerald-600">
                ${(totalHours * (user?.hourlyRate || 0)).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 