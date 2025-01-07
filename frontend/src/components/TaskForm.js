import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import taskService from '../services/taskService';

function TaskForm({ onSubmit, initialData = null }) {
  const { user } = useAuth();
  
  // Initialize form data with user's career
  const [formData, setFormData] = useState({
    date: initialData?.date?.split('T')[0] || new Date().toISOString().split('T')[0],
    shift: initialData?.shift || 'morning',
    startTime: initialData?.startTime || '',
    endTime: initialData?.endTime || '',
    // Set category from initialData, user career, or empty string as fallback
    category: initialData?.category || user?.career || '',
    description: initialData?.description || '',
    hoursWorked: initialData?.hoursWorked || ''
  });

  const [existingShifts, setExistingShifts] = useState({
    morning: false,
    afternoon: false
  });

  useEffect(() => {
    const checkExistingShifts = async () => {
      try {
        // Get tasks directly from response (no .data needed)
        const tasks = await taskService.getTasks();
        
        // Filter tasks for the selected date only
        const tasksForDate = tasks.filter(task => task.date === formData.date);
        
        setExistingShifts({
          morning: tasksForDate.some(task => task.shift === 'morning'),
          afternoon: tasksForDate.some(task => task.shift === 'afternoon')
        });
      } catch (error) {
        console.error('Error checking existing shifts:', error);
        toast.error('Failed to check existing shifts');
      }
    };

    checkExistingShifts();
  }, [formData.date]);

  // Update category whenever user data changes
  useEffect(() => {
    if (user?.career) {
      setFormData(prev => ({
        ...prev,
        category: initialData?.category || user.career
      }));
    }
  }, [user, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Check if user is logged in and has a career
      if (!user || !user.career) {
        toast.error('Unable to create task: No career specified in your profile');
        return;
      }

      // Ensure category is set from user's career
      const submissionData = {
        ...formData,
        category: user.career // Always use the user's career
      };

      // Rest of validation
      const requiredFields = ['date', 'shift', 'startTime', 'endTime', 'description'];
      const missingFields = requiredFields.filter(field => !submissionData[field]);
      
      if (missingFields.length > 0) {
        toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
      }

      // Validate hours worked
      if (!formData.hoursWorked || formData.hoursWorked <= 0) {
        toast.error('Invalid time range. End time must be after start time.');
        return;
      }

      // Check if shift is already taken (only for new tasks)
      if (!initialData && existingShifts[formData.shift]) {
        toast.error(`You already have a task recorded for the ${formData.shift} shift on ${formData.date}`);
        return;
      }

      // Validate date is not in the future
      const selectedDate = new Date(formData.date);
      const today = new Date();
      if (selectedDate > today) {
        toast.error('Cannot create tasks for future dates');
        return;
      }

      // Continue with form submission using the updated data
      await onSubmit(submissionData);
    } catch (error) {
      console.error('Error submitting task:', error);
      toast.error(error.response?.data?.message || 'Failed to submit task');
    }
  };

  const calculateHoursWorked = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;
    
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return 0;
    }
    
    let diff = (end - start) / (1000 * 60 * 60); // Convert milliseconds to hours
    
    // Handle cases where end time is on the next day
    if (diff < 0) {
      diff += 24;
    }
    
    // Round to nearest 0.5
    return Math.round(diff * 2) / 2;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If changing shift, check if it's already taken
    if (name === 'shift' && !initialData && existingShifts[value]) {
      toast.warning(`You already have a task recorded for the ${value} shift on ${formData.date}`);
      return;
    }
    
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Recalculate hours worked when time changes
      if (name === 'startTime' || name === 'endTime') {
        const hours = calculateHoursWorked(
          name === 'startTime' ? value : prev.startTime,
          name === 'endTime' ? value : prev.endTime
        );
        newData.hoursWorked = hours;
        
        // Show warning if hours worked is 0
        if (hours === 0 && newData.startTime && newData.endTime) {
          toast.warning('Invalid time range selected');
        }
      }
      
      return newData;
    });
  };

  // Add console.log to debug
  console.log('User data:', user);
  console.log('Form data:', formData);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="mt-2 block w-full rounded-md border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-gray-100 shadow-sm hover:border-gray-900 dark:hover:border-gray-500 focus:border-gray-900 dark:focus:border-gray-500 focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Shift</label>
          <select
            name="shift"
            value={formData.shift}
            onChange={handleChange}
            className={`mt-2 block w-full rounded-md border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-gray-100 shadow-sm hover:border-gray-900 dark:hover:border-gray-500 focus:border-gray-900 dark:focus:border-gray-500 focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-500 ${
              existingShifts[formData.shift] && !initialData ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : ''
            }`}
            required
          >
            <option value="morning" disabled={existingShifts.morning && !initialData}>Morning</option>
            <option value="afternoon" disabled={existingShifts.afternoon && !initialData}>Afternoon</option>
          </select>
          {existingShifts[formData.shift] && !initialData && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">This shift is already taken</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Start Time</label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="mt-2 block w-full rounded-md border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-gray-100 shadow-sm hover:border-gray-900 dark:hover:border-gray-500 focus:border-gray-900 dark:focus:border-gray-500 focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">End Time</label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="mt-2 block w-full rounded-md border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-gray-100 shadow-sm hover:border-gray-900 dark:hover:border-gray-500 focus:border-gray-900 dark:focus:border-gray-500 focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            readOnly
            className="mt-2 block w-full rounded-md border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 px-4 py-2 text-gray-900 dark:text-gray-200 shadow-sm cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Hours Worked</label>
          <input
            type="number"
            name="hoursWorked"
            value={formData.hoursWorked}
            readOnly
            step="0.5"
            className="mt-2 block w-full rounded-md border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 px-4 py-2 text-gray-900 dark:text-gray-100 shadow-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="mt-2 block w-full rounded-md border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-gray-100 shadow-sm hover:border-gray-900 dark:hover:border-gray-500 focus:border-gray-900 dark:focus:border-gray-500 focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-500"
          required
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 text-sm font-medium text-white bg-[#0072cd] rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-200"
        >
          {initialData ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}

export default TaskForm; 