import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';
import ProfileForm from '../components/ProfileForm';
import { taskService } from '../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Profile() {
  const { user } = useAuth();
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
      const response = await userService.getProfile();
      setProfile(response.data);
      setFormData(response.data);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userService.updateProfile(formData);
      await fetchProfileData();
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
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
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Card */}
        <div className="border border-gray-100 rounded-lg overflow-hidden">
          <div className="border-b border-gray-100 px-6 py-4 flex justify-between items-center">
            <h3 className="text-xl font-medium text-gray-900">Profile Information</h3>
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-[#0072cd] hover:text-[#0060ab] transition-colors duration-200"
            >
              Edit Profile
            </button>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { label: "Name", value: profile.name },
                { label: "Email", value: profile.email },
                { label: "Career", value: profile.career },
                { label: "Hourly Rate", value: `ZMW ${profile.hourlyRate}/hr` },
                { label: "Bank Name", value: profile.bankName },
                { label: "Branch Code", value: profile.branchCode },
                { label: "Account Number", value: profile.accountNumber },
              ].map((field, index) => (
                <div key={index} className="space-y-1">
                  <dt className="text-sm text-gray-500">{field.label}</dt>
                  <dd className="text-base text-gray-900">{field.value}</dd>
                </div>
              ))}
              
              <div className="md:col-span-2 space-y-1">
                <dt className="text-sm text-gray-500">Address</dt>
                <dd className="text-base text-gray-900">{profile.address}</dd>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics and Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Statistics Card */}
          <div className="border border-gray-100 rounded-lg overflow-hidden">
            <div className="border-b border-gray-100 px-6 py-4">
              <h4 className="text-lg font-medium text-gray-900">Your Statistics</h4>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: "Total Tasks", value: stats.totalTasks },
                { label: "Hours This Month", value: `${stats.monthlyHours}h` },
                { label: "Earnings This Month", value: `ZMW ${stats.monthlyEarnings.toFixed(2)}` },
              ].map((stat, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-500">{stat.label}</span>
                  <span className="text-lg font-medium text-[#0072cd]">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="border border-gray-100 rounded-lg overflow-hidden">
            <div className="border-b border-gray-100 px-6 py-4">
              <h4 className="text-lg font-medium text-gray-900">Recent Activity</h4>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {stats.recentActivity.map((task, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="mt-1">
                      <div className="h-2 w-2 rounded-full bg-[#0072cd]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{task.title}</p>
                      <p className="text-sm text-gray-500">{task.timeAgo}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal - Minimalistic styling */}
        {isEditing && (
          <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white border border-gray-100 rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-medium mb-4 text-gray-900">Edit Profile</h2>
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