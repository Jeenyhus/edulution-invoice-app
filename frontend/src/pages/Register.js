import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    hourlyRate: '',
    bankName: '',
    branchCode: '',
    accountNumber: '',
    address: '',
    career: '',  // This will be used as category alias
    phoneNumber: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    hourlyRate: '',
    bankName: '',
    branchCode: '',
    accountNumber: '',
    address: '',
    career: '',
    phoneNumber: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    // Hourly rate validation
    if (!formData.hourlyRate) {
      newErrors.hourlyRate = 'Hourly rate is required';
      isValid = false;
    } else if (isNaN(formData.hourlyRate) || parseFloat(formData.hourlyRate) < 0) {
      newErrors.hourlyRate = 'Please enter a valid hourly rate';
      isValid = false;
    }

    if (!formData.bankName.trim()) {
      newErrors.bankName = 'Bank name is required';
      isValid = false;
    }

    if (!formData.branchCode.trim()) {
      newErrors.branchCode = 'Branch code is required';
      isValid = false;
    }

    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
      isValid = false;
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
      isValid = false;
    }

    if (!formData.career.trim()) {
      newErrors.career = 'Career is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await register(formData);
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-3xl font-light text-gray-900">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join us today
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row md:space-x-8 space-y-6 md:space-y-0">
            {/* Left Column */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-col">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className={`mt-1 px-3 py-2 border ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:ring-1 focus:ring-black focus:border-black`}
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div className="flex flex-col">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={`mt-1 px-3 py-2 border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:ring-1 focus:ring-black focus:border-black`}
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="flex flex-col">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className={`mt-1 px-3 py-2 border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:ring-1 focus:ring-black focus:border-black`}
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div className="flex flex-col">
                <label htmlFor="career" className="text-sm font-medium text-gray-700">Career</label>
                <input
                  type="text"
                  name="career"
                  value={formData.career}
                  onChange={handleChange}
                  className={`mt-1 px-3 py-2 border ${
                    errors.career ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:ring-1 focus:ring-black focus:border-black`}
                  required
                />
                {errors.career && (
                  <p className="mt-1 text-sm text-red-600">{errors.career}</p>
                )}
              </div>

              <div>
                <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700">
                  Hourly Rate (ZMW)
                </label>
                <input
                  type="number"
                  name="hourlyRate"
                  id="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  placeholder="Enter rate in ZMW"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                  required
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-col">
                <label htmlFor="bankName" className="text-sm font-medium text-gray-700">Bank Name</label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  className={`mt-1 px-3 py-2 border ${
                    errors.bankName ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:ring-1 focus:ring-black focus:border-black`}
                  required
                />
                {errors.bankName && (
                  <p className="mt-1 text-sm text-red-600">{errors.bankName}</p>
                )}
              </div>

              <div className="flex flex-col">
                <label htmlFor="branchCode" className="text-sm font-medium text-gray-700">Branch Code</label>
                <input
                  type="text"
                  name="branchCode"
                  value={formData.branchCode}
                  onChange={handleChange}
                  className={`mt-1 px-3 py-2 border ${
                    errors.branchCode ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:ring-1 focus:ring-black focus:border-black`}
                  required
                />
                {errors.branchCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.branchCode}</p>
                )}
              </div>

              <div className="flex flex-col">
                <label htmlFor="accountNumber" className="text-sm font-medium text-gray-700">Account Number</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  className={`mt-1 px-3 py-2 border ${
                    errors.accountNumber ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:ring-1 focus:ring-black focus:border-black`}
                  required
                />
                {errors.accountNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.accountNumber}</p>
                )}
              </div>

              <div className="flex flex-col">
                <label htmlFor="address" className="text-sm font-medium text-gray-700">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className={`mt-1 px-3 py-2 border ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:ring-1 focus:ring-black focus:border-black`}
                  required
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 text-sm text-red-600">
              <p>{error}</p>
            </div>
          )}

          <div className="mt-8 flex flex-col items-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-1/2 py-2 px-4 border border-transparent rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Create Account'
              )}
            </button>
            
            <div className="mt-4 flex items-center space-x-1 text-sm">
              <span className="text-gray-500">Already have an account?</span>
              <Link to="/login" className="font-medium text-black hover:text-gray-700">
                Sign in
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register; 