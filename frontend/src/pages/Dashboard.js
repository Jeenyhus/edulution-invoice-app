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
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">
        Welcome back, {user?.name}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Recent Tasks
          </h2>
          <div className="space-y-4">
            {recentTasks.map((task) => (
              <div key={task.id} className="border-b pb-2">
                <p key={`${task.id}-desc`} className="font-medium">{task.description}</p>
                <p key={`${task.id}-date`} className="text-sm text-gray-500">
                  {new Date(task.date).toLocaleDateString()} - {task.hoursWorked} hours
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Summary
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Total Hours This Month</p>
              <p className="text-2xl font-semibold">{totalHours}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Estimated Earnings</p>
              <p className="text-2xl font-semibold">
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