import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProfileForm({ onSubmit, initialData, onCancel }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState(initialData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert empty string to 0 before parsing
    const hourlyRate = parseFloat(formData.hourlyRate || '0');
    
    // Validate hourly rate
    if (isNaN(hourlyRate) || hourlyRate <= 0) {
      toast.error('Please enter a valid hourly rate greater than 0');
      return;
    }

    const updatedData = {
      ...formData,
      hourlyRate: hourlyRate // Store as number, not string
    };

    try {
      await onSubmit({ event: e, data: updatedData });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-black dark:focus:border-gray-300 focus:ring-black dark:focus:ring-gray-300"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-black dark:focus:border-gray-300 focus:ring-black dark:focus:ring-gray-300"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Career</label>
        <input
          type="text"
          value={formData.career}
          onChange={(e) => setFormData({ ...formData, career: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-black dark:focus:border-gray-300 focus:ring-black dark:focus:ring-gray-300"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Hourly Rate (ZMW)
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={formData.hourlyRate}
          onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-black dark:focus:border-gray-300 focus:ring-black dark:focus:ring-gray-300"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-black dark:focus:border-gray-300 focus:ring-black dark:focus:ring-gray-300"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bank Name</label>
        <input
          type="text"
          value={formData.bankName}
          onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-black dark:focus:border-gray-300 focus:ring-black dark:focus:ring-gray-300"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Branch Code</label>
        <input
          type="text"
          value={formData.branchCode}
          onChange={(e) => setFormData({ ...formData, branchCode: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-black dark:focus:border-gray-300 focus:ring-black dark:focus:ring-gray-300"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Account Number</label>
        <input
          type="text"
          value={formData.accountNumber}
          onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-black dark:focus:border-gray-300 focus:ring-black dark:focus:ring-gray-300"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-black dark:bg-gray-700 rounded-md hover:bg-gray-800 dark:hover:bg-gray-600"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}

export default ProfileForm; 