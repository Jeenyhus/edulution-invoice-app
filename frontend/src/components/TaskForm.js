import { useState, useEffect } from 'react';
import { taskService } from '../services/api';

function TaskForm({ onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({
    date: initialData?.date?.split('T')[0] || new Date().toISOString().split('T')[0],
    shift: initialData?.shift || 'morning',
    startTime: initialData?.startTime || '',
    endTime: initialData?.endTime || '',
    category: initialData?.category || '',
    description: initialData?.description || '',
    hoursWorked: initialData?.hoursWorked || ''
  });
  
  const [existingShifts, setExistingShifts] = useState({
    morning: false,
    afternoon: false
  });

  useEffect(() => {
    // Check for existing shifts when date changes
    const checkExistingShifts = async () => {
      try {
        const response = await taskService.getTasks();
        // Filter tasks for the selected date only
        const tasksForDate = response.data.filter(task => task.date === formData.date);
        
        setExistingShifts({
          morning: tasksForDate.some(task => task.shift === 'morning'),
          afternoon: tasksForDate.some(task => task.shift === 'afternoon')
        });
      } catch (error) {
        console.error('Error checking existing shifts:', error);
      }
    };

    checkExistingShifts();
  }, [formData.date]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if shift is already taken
    if (existingShifts[formData.shift] && !initialData) {
      alert(`You already have a task recorded for the ${formData.shift} shift on ${formData.date}. Only one task per shift is allowed.`);
      return;
    }
    
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If changing shift, check if it's already taken
    if (name === 'shift' && existingShifts[value] && !initialData) {
      alert(`You already have a task recorded for the ${value} shift on ${formData.date}. Please select a different shift.`);
      return;
    }
    
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Calculate hours worked when start or end time changes
      if (name === 'startTime' || name === 'endTime') {
        if (newData.startTime && newData.endTime) {
          const start = new Date(`1970-01-01T${newData.startTime}`);
          const end = new Date(`1970-01-01T${newData.endTime}`);
          let diff = (end - start) / (1000 * 60 * 60); // Convert milliseconds to hours
          
          // Handle cases where end time is on the next day
          if (diff < 0) {
            diff += 24;
          }
          
          // Round to nearest 0.5
          newData.hoursWorked = Math.round(diff * 2) / 2;
        }
      }
      
      return newData;
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-900">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="mt-2 block w-full rounded-md border-gray-200 bg-white px-4 py-2 text-gray-900 shadow-sm hover:border-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">Shift</label>
          <select
            name="shift"
            value={formData.shift}
            onChange={handleChange}
            className={`mt-2 block w-full rounded-md border-gray-200 bg-white px-4 py-2 text-gray-900 shadow-sm hover:border-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 ${
              existingShifts[formData.shift] && !initialData ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
            required
          >
            <option value="morning" disabled={existingShifts.morning && !initialData}>Morning</option>
            <option value="afternoon" disabled={existingShifts.afternoon && !initialData}>Afternoon</option>
          </select>
          {existingShifts[formData.shift] && !initialData && (
            <p className="mt-1 text-sm text-red-600">This shift is already taken</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">Start Time</label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="mt-2 block w-full rounded-md border-gray-200 bg-white px-4 py-2 text-gray-900 shadow-sm hover:border-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">End Time</label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="mt-2 block w-full rounded-md border-gray-200 bg-white px-4 py-2 text-gray-900 shadow-sm hover:border-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-2 block w-full rounded-md border-gray-200 bg-white px-4 py-2 text-gray-900 shadow-sm hover:border-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">Hours Worked</label>
          <input
            type="number"
            name="hoursWorked"
            value={formData.hoursWorked}
            readOnly
            step="0.5"
            className="mt-2 block w-full rounded-md border-gray-200 bg-gray-100 px-4 py-2 text-gray-900 shadow-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="mt-2 block w-full rounded-md border-gray-200 bg-white px-4 py-2 text-gray-900 shadow-sm hover:border-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
          required
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-200"
        >
          {initialData ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}

export default TaskForm; 