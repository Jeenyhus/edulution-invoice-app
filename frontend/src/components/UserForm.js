import { useState } from 'react';

function UserForm({ onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    role: initialData?.role || 'user',
    hourlyRate: initialData?.hourlyRate || '',
    password: '' // Only required for new users
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // If editing, don't send password if it's empty
    const submitData = initialData && !formData.password
      ? { ...formData, password: undefined }
      : formData;
    onSubmit(submitData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Hourly Rate</label>
        <input
          type="number"
          name="hourlyRate"
          value={formData.hourlyRate}
          onChange={handleChange}
          step="0.01"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      {(!initialData || formData.password) && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {initialData ? 'New Password (leave blank to keep current)' : 'Password'}
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            {...(!initialData && { required: true })}
          />
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {initialData ? 'Update User' : 'Create User'}
        </button>
      </div>
    </form>
  );
}

export default UserForm; 