import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import settingsService from '../services/settingsService';
import { toast } from 'react-toastify';

function Settings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    // Company Settings
    companyName: 'Edulution',
    companyEmail: 'info@edulution.org',
    
    // Time & Attendance
    maxHoursPerDay: 8,
    maxHoursPerWeek: 40,
    overtimeMultiplier: 1.5,
    
    // Department Settings
    allowDepartmentCreation: true,
    allowCareerCreation: true,
    
    // User Management
    defaultHourlyRate: 50,
    allowUserRegistration: true,
    requireEmailVerification: true,
    
    // Task Management
    allowTaskEditing: true,
    taskEditTimeLimit: 24,
    requireTaskApproval: true,
    
    // Notifications
    emailNotifications: true,
    taskReminders: true,
    approvalNotifications: true
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await settingsService.getSettings();
      setSettings(response.data);
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await settingsService.updateSettings(settings);
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    }
  };

  if (loading) {
    return <div className="p-4">Loading settings...</div>;
  }

  if (user?.role !== 'superadmin') {
    return <div className="p-4">You don't have permission to access settings.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold mb-6">System Settings</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Company Settings */}
        <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Company Settings</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={settings.companyName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Company Email</label>
              <input
                type="email"
                name="companyEmail"
                value={settings.companyEmail}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </div>
          </div>
        </section>

        {/* Time & Attendance Settings */}
        <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Time & Attendance</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium">Max Hours Per Day</label>
              <input
                type="number"
                name="maxHoursPerDay"
                value={settings.maxHoursPerDay}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Max Hours Per Week</label>
              <input
                type="number"
                name="maxHoursPerWeek"
                value={settings.maxHoursPerWeek}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Overtime Multiplier</label>
              <input
                type="number"
                step="0.1"
                name="overtimeMultiplier"
                value={settings.overtimeMultiplier}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </div>
          </div>
        </section>

        {/* Task Management Settings */}
        <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Task Management</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="allowTaskEditing"
                checked={settings.allowTaskEditing}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label className="ml-2 block text-sm">Allow Task Editing</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="requireTaskApproval"
                checked={settings.requireTaskApproval}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label className="ml-2 block text-sm">Require Task Approval</label>
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-primary-DEFAULT text-white rounded-md hover:bg-primary-dark"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}

export default Settings; 