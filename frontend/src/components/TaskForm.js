import { useState } from 'react';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
            className="mt-2 block w-full rounded-md border-gray-200 bg-white px-4 py-2 text-gray-900 shadow-sm hover:border-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            required
          >
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
          </select>
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
            onChange={handleChange}
            step="0.5"
            className="mt-2 block w-full rounded-md border-gray-200 bg-white px-4 py-2 text-gray-900 shadow-sm hover:border-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            required
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