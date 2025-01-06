import { useState, useEffect, useCallback } from 'react';
import { userService, taskService } from '../services';
import ProfileForm from '../components/ProfileForm';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { calculateEarnings } from '../utils/calculations';
import { useAuth } from '../contexts/AuthContext';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [stats, setStats] = useState({
    totalTasks: 0,
    monthlyHours: 0,
    monthlyEarnings: 0,
    recentActivity: []
  });

  const fetchProfileData = useCallback(async () => {
    try {
      const [profileResponse, tasksResponse] = await Promise.all([
        userService.getProfile(),
        taskService.getTasks()
      ]);

      const profile = profileResponse.data;
      const tasks = tasksResponse.data;

      // Calculate monthly stats
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const monthlyTasks = tasks.filter(task => new Date(task.date) >= startOfMonth);
      const monthlyHours = monthlyTasks.reduce((acc, task) => {
        return acc + (parseFloat(task.hoursWorked) || 0);
      }, 0);
      
      const monthlyEarnings = calculateEarnings(monthlyHours, profile.hourlyRate);

      setProfile(profile);
      setFormData(profile);
      setStats({
        totalTasks: tasks.length,
        monthlyHours: Math.round(monthlyHours * 100) / 100,
        monthlyEarnings: Math.round(monthlyEarnings * 100) / 100,
        recentActivity: tasks
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5)
          .map(task => ({
            title: task.description,
            timeAgo: formatTimeAgo(new Date(task.date))
          }))
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch profile data');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  // Set up event listeners for task updates
  useEffect(() => {
    const handleTaskUpdate = () => {
      fetchProfileData();
    };

    window.addEventListener('taskCreated', handleTaskUpdate);
    window.addEventListener('taskUpdated', handleTaskUpdate);
    window.addEventListener('taskDeleted', handleTaskUpdate);

    // Initial fetch
    fetchProfileData();

    return () => {
      window.removeEventListener('taskCreated', handleTaskUpdate);
      window.removeEventListener('taskUpdated', handleTaskUpdate);
      window.removeEventListener('taskDeleted', handleTaskUpdate);
    };
  }, [fetchProfileData]);

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

  const handleSubmit = async ({ event, data }) => {
    event.preventDefault();
    try {
      await userService.updateProfile(data);
      await fetchProfileData();
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const calculateStats = (tasks, profile) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const monthlyTasks = tasks.filter(task => new Date(task.date) >= startOfMonth);
    const monthlyHours = monthlyTasks.reduce((acc, task) => {
      return acc + (parseFloat(task.hoursWorked) || 0);
    }, 0);
    
    return {
      monthlyHours: Math.round(monthlyHours * 100) / 100,
      monthlyEarnings: calculateEarnings(monthlyHours, profile.hourlyRate || 0)
    };
  };

  const handleProfileUpdate = async (formData) => {
    try {
      // Validate hourly rate
      const hourlyRate = parseFloat(formData.hourlyRate);
      if (isNaN(hourlyRate) || hourlyRate <= 0) {
        toast.error('Please enter a valid hourly rate');
        return;
      }

      const response = await userService.updateProfile({
        ...formData,
        hourlyRate: hourlyRate
      });

      if (response.data) {
        setProfile(response.data);
        setIsEditing(false);
        toast.success('Profile updated successfully');
        // Trigger a refresh of dashboard data
        window.dispatchEvent(new Event('profileUpdated'));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-red-600 dark:text-red-400">{error}</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-400">No profile data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Hero Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="relative p-8">
            <div className="max-w-3xl">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Profile</h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Manage your personal and payment information
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary-DEFAULT/10 dark:bg-primary-DEFAULT/20 rounded-xl">
                <svg className="w-6 h-6 text-primary-DEFAULT" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary-DEFAULT/10 dark:bg-primary-DEFAULT/20 rounded-xl">
                <svg className="w-6 h-6 text-primary-DEFAULT" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Hours This Month</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.monthlyHours}h</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary-DEFAULT/10 dark:bg-primary-DEFAULT/20 rounded-xl">
                <svg className="w-6 h-6 text-primary-DEFAULT" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Earnings</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">ZMW {stats.monthlyEarnings.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Information</h2>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm text-primary-DEFAULT hover:text-primary-dark dark:text-primary-DEFAULT dark:hover:text-primary-light transition-colors"
                >
                  Edit Profile
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Name", value: profile.name },
                  { label: "Email", value: profile.email },
                  { label: "Career", value: profile.career },
                  { label: "Hourly Rate", value: `ZMW ${profile.hourlyRate}/hr` },
                  { label: "Bank Name", value: profile.bankName },
                  { label: "Branch Code", value: profile.branchCode },
                  { label: "Account Number", value: profile.accountNumber },
                  { label: "Address", value: profile.address },
                ].map((field, index) => (
                  <div key={index} className="space-y-1">
                    <dt className="text-sm text-gray-500 dark:text-gray-400">{field.label}</dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">{field.value}</dd>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Recent Activity</h2>
              <div className="space-y-6">
                {stats.recentActivity.map((task, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="mt-1">
                      <div className="h-2 w-2 rounded-full bg-primary-DEFAULT/60 dark:bg-primary-DEFAULT/80" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{task.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{task.timeAgo}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Edit Profile</h2>
              <ProfileForm
                onSubmit={handleSubmit}
                initialData={formData}
                onCancel={() => setIsEditing(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile; 