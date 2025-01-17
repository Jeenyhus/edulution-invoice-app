import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { departmentService } from '../services';
import { toast } from 'react-hot-toast';


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
    career: '',
    career_id: null,
    department_id: null,
    phoneNumber: '',
    passwordConfirm: ''
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
    phoneNumber: '',
    passwordConfirm: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [careers, setCareers] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await departmentService.getDepartments();
        if (response && Array.isArray(response)) {
          setDepartments(response);
          // If there are departments, set the careers for the first one
          if (response.length > 0) {
            setCareers(response[0].careers || []);
          }
        } else {
          console.error('Invalid departments data:', response);
          toast.error('Failed to load departments');
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
        toast.error('Failed to load departments');
        setDepartments([]); // Set empty array as fallback
        setCareers([]); // Set empty array as fallback
      }
    };
    
    fetchDepartments();
  }, []);

  const handleDepartmentChange = (e) => {
    const deptId = e.target.value;
    const selectedDept = departments.find(d => d.id === parseInt(deptId));
    
    setFormData(prev => ({
      ...prev,
      department_id: deptId,
      career: '',  // Reset career when department changes
      career_id: '' // Reset career_id when department changes
    }));

    // Update available careers for selected department
    setCareers(selectedDept ? selectedDept.careers : []);
  };

  const handleCareerChange = (e) => {
    const careerName = e.target.value;
    const selectedCareer = careers.find(c => c.name === careerName);
    
    setFormData(prev => ({
      ...prev,
      career: careerName,
      career_id: selectedCareer ? selectedCareer.id : ''
    }));
  };

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
    } else if (!formData.email.endsWith('@edulution.org')) {
      newErrors.email = 'Only @edulution.org email addresses are allowed';
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
    const hourlyRate = parseFloat(formData.hourlyRate);
    if (!formData.hourlyRate) {
      newErrors.hourlyRate = 'Hourly rate is required';
      isValid = false;
    } else if (isNaN(hourlyRate) || hourlyRate <= 0) {
      newErrors.hourlyRate = 'Please enter a valid hourly rate greater than 0';
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
    setLoading(true);
    setError('');

    try {
      // Validate form data
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setLoading(false);
        return;
      }

      // Ensure hourlyRate is a number
      const userData = {
        ...formData,
        hourlyRate: parseFloat(formData.hourlyRate)
      };

      // Call the register function from AuthContext
      await register(userData);
      
      // Show success message
      toast.success('Registration successful! Please log in.');
      
      // Redirect to login page
      navigate('/login', { state: { registrationSuccess: true } });
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.message || 'Failed to create account');
      toast.error(error.response?.data?.message || 'Failed to create account');
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-50 p-4 rounded-md shadow-lg z-50">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Account created successfully! Redirecting to login...
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed top-4 right-4 bg-red-50 dark:bg-red-900/30 p-4 rounded-md shadow-lg z-50">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400 dark:text-red-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="flex flex-col items-center">
          <img
            src='/favicon_confluence.png'
            alt="Logo"
            className="h-12 mb-4"
          />
          <h2 className="text-3xl font-light text-gray-900 dark:text-white">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Join us today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Personal Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } rounded-md shadow-sm focus:ring-1 focus:ring-primary-DEFAULT dark:focus:ring-primary-light focus:border-primary-DEFAULT dark:focus:border-primary-light bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    required
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                    <span className="text-xs text-gray-500 ml-1">(must be an @edulution.org email)</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md ${
                      errors.email 
                        ? 'border-red-500 dark:border-red-400' 
                        : 'border-gray-300 dark:border-gray-600'
                    } dark:bg-gray-700 dark:text-white shadow-sm focus:border-black dark:focus:border-gray-300 focus:ring-black dark:focus:ring-gray-300`}
                    required
                    pattern=".*@edulution\.org$"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                  )}
                </div>

                <div className="flex flex-col md:flex-row md:space-x-4">
                  <div className="flex-1 mb-4 md:mb-0">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${
                        errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } rounded-md shadow-sm focus:ring-1 focus:ring-primary-DEFAULT dark:focus:ring-primary-light focus:border-primary-DEFAULT dark:focus:border-primary-light bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      required
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                    )}
                  </div>

                  <div className="flex-1">
                    <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="passwordConfirm"
                      id="passwordConfirm"
                      value={formData.passwordConfirm}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${
                        errors.passwordConfirm ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } rounded-md shadow-sm focus:ring-1 focus:ring-primary-DEFAULT dark:focus:ring-primary-light focus:border-primary-DEFAULT dark:focus:border-primary-light bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      required
                    />
                    {errors.passwordConfirm && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.passwordConfirm}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Professional Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Department
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department_id || ''}
                    onChange={handleDepartmentChange}
                    className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-1 focus:ring-primary-DEFAULT dark:focus:ring-primary-light focus:border-primary-DEFAULT dark:focus:border-primary-light bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments && departments.length > 0 ? (
                      departments.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))
                    ) : (
                      <option value="" disabled>No departments available</option>
                    )}
                  </select>
                </div>

                <div>
                  <label htmlFor="career" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Career
                  </label>
                  <select
                    id="career"
                    name="career"
                    value={formData.career || ''}
                    onChange={handleCareerChange}
                    className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-1 focus:ring-primary-DEFAULT dark:focus:ring-primary-light focus:border-primary-DEFAULT dark:focus:border-primary-light bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                    disabled={!formData.department_id}
                  >
                    <option value="">Select Career</option>
                    {careers && careers.length > 0 ? (
                      careers.map(career => (
                        <option key={career.id} value={career.name}>
                          {career.name}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>No careers available</option>
                    )}
                  </select>
                </div>

                <div>
                  <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Hourly Rate (ZMW)
                  </label>
                  <input
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.hourlyRate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } rounded-md shadow-sm focus:ring-1 focus:ring-primary-DEFAULT dark:focus:ring-primary-light focus:border-primary-DEFAULT dark:focus:border-primary-light bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    required
                  />
                  {errors.hourlyRate && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.hourlyRate}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Banking Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Banking Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.bankName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-md shadow-sm focus:ring-1 focus:ring-primary-DEFAULT dark:focus:ring-primary-light focus:border-primary-DEFAULT dark:focus:border-primary-light bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  required
                />
                {errors.bankName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.bankName}</p>
                )}
              </div>

              <div>
                <label htmlFor="branchCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Branch Code
                </label>
                <input
                  type="text"
                  name="branchCode"
                  value={formData.branchCode}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.branchCode ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-md shadow-sm focus:ring-1 focus:ring-primary-DEFAULT dark:focus:ring-primary-light focus:border-primary-DEFAULT dark:focus:border-primary-light bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  required
                />
                {errors.branchCode && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.branchCode}</p>
                )}
              </div>

              <div>
                <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.accountNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-md shadow-sm focus:ring-1 focus:ring-primary-DEFAULT dark:focus:ring-primary-light focus:border-primary-DEFAULT dark:focus:border-primary-light bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  required
                />
                {errors.accountNumber && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.accountNumber}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Contact Information
            </h3>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className={`w-full px-3 py-2 border ${
                  errors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } rounded-md shadow-sm focus:ring-1 focus:ring-primary-DEFAULT dark:focus:ring-primary-light focus:border-primary-DEFAULT dark:focus:border-primary-light bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                required
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.address}</p>
              )}
            </div>
          </div>

          {/* Submit Button and Sign In Link */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-center space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-1/2 py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-[#0072cd] hover:bg-[#0066b8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0072cd] transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-gray-800"
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
              
              <div className="flex items-center space-x-1 text-sm">
                <span className="text-gray-500 dark:text-gray-400">Already have an account?</span>
                <Link to="/login" className="font-medium text-[#0072cd] hover:text-[#0066b8] dark:text-[#3b82f6] dark:hover:text-[#60a5fa] transition-colors">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register; 