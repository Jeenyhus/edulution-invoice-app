import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
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
    return `inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors duration-200
      ${isActive 
        ? 'border-gray-900 text-gray-900' 
        : 'text-gray-500 border-transparent hover:border-gray-900 hover:text-gray-900'
      }`;
  };

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0 flex items-center">
              <img
                src="/favicon_confluence.png"
                alt="Edulution Logo"
                className="h-10 w-auto"
              />
            </Link>
            
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link
                to="/dashboard"
                className={getLinkClasses('/dashboard')}
              >
                Dashboard
              </Link>
              <Link
                to="/tasks"
                className={getLinkClasses('/tasks')}
              >
                Tasks
              </Link>
              <Link
                to="/invoices"
                className={getLinkClasses('/invoices')}
              >
                Invoices
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/users"
                  className={getLinkClasses('/users')}
                >
                  Users
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* User Menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-6">
            <div className="flex items-center space-x-3">
              <Link to="/profile" className="flex items-center space-x-2 hover:opacity-80">
                <img
                  src={`https://ui-avatars.com/api/?name=${user?.name}&background=000&color=fff`}
                  alt={user?.name}
                  className="h-8 w-8 rounded-full"
                />
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg
                  text-gray-900 bg-white border border-gray-200
                  hover:bg-gray-50 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div className="sm:hidden hidden">
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className={`block pl-3 pr-4 py-2 text-base font-medium ${
              location.pathname === '/'
                ? 'text-gray-900 bg-gray-50'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/tasks"
            className={`block pl-3 pr-4 py-2 text-base font-medium ${
              location.pathname === '/tasks'
                ? 'text-gray-900 bg-gray-50'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Tasks
          </Link>
          <Link
            to="/invoices"
            className={`block pl-3 pr-4 py-2 text-base font-medium ${
              location.pathname === '/invoices'
                ? 'text-gray-900 bg-gray-50'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Invoices
          </Link>
          {user?.role === 'admin' && (
            <Link
              to="/users"
              className={`block pl-3 pr-4 py-2 text-base font-medium ${
                location.pathname === '/users'
                  ? 'text-gray-900 bg-gray-50'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Users
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 