import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img
                src="/favicon_confluence.png"
                alt="Edulution Logo"
                className="h-10 w-auto"
              />
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <div className="flex items-center space-x-3">
                    <Link to="/profile" className="flex items-center space-x-2 hover:opacity-80">
                      <img
                        src={`https://ui-avatars.com/api/?name=${user?.name}&background=000&color=fff`}
                        alt={user?.name}
                        className="h-8 w-8 rounded-full"
                      />
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm font-medium px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Simplify Your Invoice Management
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              Streamline your time tracking, task logging, and invoice generation in one powerful platform.
            </p>
            <Link
              to="/register"
              className="inline-block px-8 py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-lg font-medium"
            >
              Start For Free
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-6 bg-black rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Time Tracking</h3>
              <p className="text-gray-600">Effortlessly log your work hours and manage tasks with precision.</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-6 bg-black rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Invoice Generation</h3>
              <p className="text-gray-600">Automatically generate professional invoices from your logged tasks.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-6 bg-black rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Analytics</h3>
              <p className="text-gray-600">Track your progress and earnings with detailed insights.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Ready to streamline your workflow?
          </h2>
          <p className="text-lg text-gray-600 mb-10">
            Join thousands of professionals who trust our platform for their invoice management needs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              to="/register"
              className="px-8 py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-lg font-medium"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 border border-gray-200 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors text-lg font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <img
              src="/edulution_logo-removebg-preview.png"
              alt="Edulution Logo"
              className="h-15 w-auto mx-auto mb-4"
            />
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Edulution. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage; 