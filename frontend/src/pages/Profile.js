import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';
import ProfileForm from '../components/ProfileForm';
import { taskService } from '../services/api';

function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState({
    totalTasks: 0,
    monthlyHours: 0,
    monthlyEarnings: 0,
    recentActivity: []
  });

  const fetchProfileData = async () => {
    try {
      const [profileRes, tasksRes] = await Promise.all([
        userService.getProfile(),
        taskService.getTasks()
      ]);

      setProfile(profileRes.data);

      // Calculate statistics from tasks
      const tasks = tasksRes.data;
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const monthlyTasks = tasks.filter(task => {
        const taskDate = new Date(task.date);
        return taskDate >= firstDayOfMonth && taskDate <= now;
      });

      // Calculate monthly hours with proper number handling
      const monthlyHours = monthlyTasks.reduce((acc, task) => {
        const hours = parseFloat(task.hoursWorked);
        return acc + (isNaN(hours) ? 0 : hours);
      }, 0);
      
      const roundedMonthlyHours = Math.round(monthlyHours * 100) / 100;
      const hourlyRate = parseFloat(profileRes.data.hourlyRate) || 0;
      const monthlyEarnings = roundedMonthlyHours * hourlyRate;

      setStats({
        totalTasks: tasks.length,
        monthlyHours: roundedMonthlyHours,
        monthlyEarnings: monthlyEarnings,
        recentActivity: tasks
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5)
          .map(task => ({
            ...task,
            timeAgo: formatTimeAgo(new Date(task.date))
          }))
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchProfileData();
  }, []);

  // Set up event listeners for task updates
  useEffect(() => {
    const handleTaskUpdate = () => {
      fetchProfileData();
    };

    window.addEventListener('taskCreated', handleTaskUpdate);
    window.addEventListener('taskUpdated', handleTaskUpdate);
    window.addEventListener('taskDeleted', handleTaskUpdate);

    return () => {
      window.removeEventListener('taskCreated', handleTaskUpdate);
      window.removeEventListener('taskUpdated', handleTaskUpdate);
      window.removeEventListener('taskDeleted', handleTaskUpdate);
    };
  }, []);

  // Helper function to format time ago
  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
      }
    }
    return 'Just now';
  };

  const handleUpdateProfile = async (updatedData) => {
    try {
      const response = await userService.updateProfile(updatedData);
      setProfile(response.data);
      setIsEditing(false);
    } catch (error) {
      setError('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">No profile data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Profile Information</h3>
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800"
              >
                Edit Profile
              </button>
            </div>
            
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{profile.name}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{profile.email}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Career</dt>
                <dd className="mt-1 text-sm text-gray-900">{profile.career}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Hourly Rate</dt>
                <dd className="mt-1 text-sm text-gray-900">ZMW {profile.hourlyRate}/hr</dd>
              </div>

              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="mt-1 text-sm text-gray-900">{profile.address}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Bank Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{profile.bankName}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Branch Code</dt>
                <dd className="mt-1 text-sm text-gray-900">{profile.branchCode}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Account Number</dt>
                <dd className="mt-1 text-sm text-gray-900">{profile.accountNumber}</dd>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-white shadow rounded-lg p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Your Statistics</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Tasks</span>
                <span className="text-2xl font-semibold">{stats.totalTasks}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Hours This Month</span>
                <span className="text-2xl font-semibold">{stats.monthlyHours}h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Earnings This Month</span>
                <span className="text-2xl font-semibold text-green-600">
                  ZMW {stats.monthlyEarnings.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h4>
            <div className="space-y-4">
              {stats.recentActivity.map((task, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Completed Task: {task.title}</p>
                    <p className="text-sm text-gray-500">{task.timeAgo}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            <ProfileForm
              onSubmit={handleUpdateProfile}
              initialData={profile}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile; 