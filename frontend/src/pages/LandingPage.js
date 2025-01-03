import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        {/* Enhanced Hero Section with better spacing */}
        <div className="max-w-4xl mx-auto text-center my-12 sm:my-20">
          <div className="space-y-16 animate-fade-in">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-black tracking-tighter pt-8">
              <span className="inline-block animate-slide-up opacity-0 [animation-delay:200ms]">
                Simplify Your
              </span>{" "}
              <span className="inline-block text-[#0072cd] animate-slide-up opacity-0 [animation-delay:400ms]">
                Invoice
              </span>{" "}
              <span className="inline-block animate-slide-up opacity-0 [animation-delay:600ms]">
                Management
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-2xl mx-auto animate-fade-in opacity-0 [animation-delay:800ms] px-4">
              Streamline your time tracking, task logging, and invoice generation in one powerful platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 animate-fade-in opacity-0 [animation-delay:1000ms] py-8">
              <Link
                to="/register"
                className="group px-8 py-4 bg-[#0072cd] text-white rounded-lg transition-all duration-300 text-lg font-medium w-full sm:w-auto hover:bg-[#0060ab] hover:scale-105"
              >
                Start For Free
                <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
              </Link>
              {!user && (
                <Link
                  to="/login"
                  className="group px-8 py-4 border-2 border-black text-black rounded-lg transition-all duration-300 text-lg font-medium w-full sm:w-auto hover:bg-black hover:text-white hover:scale-105"
                >
                  Sign In
                  <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Add these keyframes and animations to your CSS/Tailwind config */}
        <style jsx>{`
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes slide-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in {
            animation: fade-in 0.6s ease-out forwards;
          }

          .animate-slide-up {
            animation: slide-up 0.6s ease-out forwards;
          }
        `}</style>

        {/* Minimalist Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-7xl mx-auto mt-20 sm:mt-32 px-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-[#0072cd] rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Time Tracking</h3>
            <p className="text-gray-600">Effortlessly log your work hours with precision.</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-[#0072cd] rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Invoice Generation</h3>
            <p className="text-gray-600">Automatically generate professional invoices from your logged tasks.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-[#0072cd] rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Analytics</h3>
            <p className="text-gray-600">Track your progress and earnings with detailed insights.</p>
          </div>
        </div>

        {/* Minimal Footer */}
        <footer className="w-full py-12 mt-20 sm:mt-32">
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Edulution. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default LandingPage; 