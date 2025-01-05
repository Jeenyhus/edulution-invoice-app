import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

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
    return `relative px-3 py-2 text-sm font-medium transition-colors
      ${isActive 
        ? 'text-[#0072cd]' 
        : 'text-gray-600 hover:text-gray-900'
      }
      ${isActive ? 'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#0072cd]' : ''}
    `;
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and Desktop Navigation */}
          <div className="flex items-center">
          <Link to="/dashboard" className="flex-shrink-0 hidden md:flex items-center">
    <img
      src="/favicon_confluence.png"
      alt="Logo"
      className="h-8 w-auto"
    />
  </Link>
  
  {/* Desktop Navigation */}
  <div className="hidden md:ml-8 md:flex md:items-center md:space-x-1">
              <Link to="/dashboard" className={getLinkClasses('/dashboard')}>
                Dashboard
              </Link>
              <Link to="/tasks" className={getLinkClasses('/tasks')}>
                Tasks
              </Link>
              <Link to="/invoices" className={getLinkClasses('/invoices')}>
                Invoices
              </Link>
              {user?.role === 'admin' && (
                <Link to="/users" className={getLinkClasses('/users')}>
                  Users
                </Link>
              )}
            </div>
          </div>

          {/* Right side - User Menu & Mobile Menu Button */}
          <div className="flex items-center">
            {/* Desktop User Menu */}
            <div className="hidden md:flex md:items-center md:space-x-2">
              <Link 
                to="/profile"
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <img
                  src={`https://ui-avatars.com/api/?name=${user?.name}&background=0072cd&color=fff`}
                  alt={user?.name}
                  className="h-8 w-8 rounded-full"
                />
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                Logout
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              <svg 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
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
            {user?.role === 'admin' && (
              <Link
                to="/users"
                className={`block ${getLinkClasses('/users')}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Users
              </Link>
            )}
          </div>
          
          {/* Mobile User Menu */}
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="px-2 space-y-1">
              <Link
                to="/profile"
                className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
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