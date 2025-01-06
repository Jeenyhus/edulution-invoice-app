import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Debug log to check user object
  console.log('Current user:', user);
  
  // Check if user has admin privileges
  const isAdminUser = user?.role === 'admin' || user?.role === 'superadmin';
  console.log('Is admin user:', isAdminUser);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getLinkClasses = (path) => {
    const isActive = location.pathname === path;
    return `px-3 py-2 text-sm font-medium ${
      isActive
        ? 'text-gray-900 dark:text-white'
        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
    }`;
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/dashboard">
              <img src="/favicon_confluence.png" alt="Logo" className="h-8 w-auto" />
            </Link>
          </div>

          {/* Center - Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:justify-center flex-1 px-8">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className={getLinkClasses('/dashboard')}>
                Dashboard
              </Link>
              <Link to="/tasks" className={getLinkClasses('/tasks')}>
                Tasks
              </Link>
              <Link to="/invoices" className={getLinkClasses('/invoices')}>
                Invoices
              </Link>
              {isAdminUser && (
                <>
                  <Link to="/users" className={getLinkClasses('/users')}>
                    Users
                  </Link>
                  <Link to="/reports" className={getLinkClasses('/reports')}>
                    Reports
                  </Link>
                  <Link to="/settings" className={getLinkClasses('/settings')}>
                    Settings
                  </Link>
                </>
              )}
              {user?.role === 'superadmin' && (
                <Link to="/system" className={getLinkClasses('/system')}>
                  System
                </Link>
              )}
            </div>
          </div>

          {/* Right side - User Menu */}
          <div className="hidden md:flex md:items-center">
            <div className="flex items-center space-x-4">
              <Link
                to="/profile"
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          {/* Mobile Navigation Links */}
          <div className="px-4 pt-2 pb-3 space-y-1 flex flex-col items-center">
            <Link
              to="/dashboard"
              className={`block ${getLinkClasses('/dashboard')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/tasks"
              className={`block ${getLinkClasses('/tasks')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Tasks
            </Link>
            <Link
              to="/invoices"
              className={`block ${getLinkClasses('/invoices')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Invoices
            </Link>
            {isAdminUser && (
              <>
                <Link
                  to="/users"
                  className={`block ${getLinkClasses('/users')}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Users
                </Link>
                <Link
                  to="/reports"
                  className={`block ${getLinkClasses('/reports')}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Reports
                </Link>
                <Link
                  to="/settings"
                  className={`block ${getLinkClasses('/settings')}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Settings
                </Link>
              </>
            )}
            {user?.role === 'superadmin' && (
              <Link
                to="/system"
                className={`block ${getLinkClasses('/system')}`}
                onClick={() => setIsMenuOpen(false)}
              >
                System
              </Link>
            )}
          </div>
          
          {/* Mobile User Menu */}
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            <div className="px-4 space-y-1 flex flex-col items-center">
              <Link
                to="/profile"
                className="block px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar; 