import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Users from './pages/Users';
import Invoices from './pages/Invoices';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Profile from './pages/Profile';
import LandingPage from './pages/LandingPage';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <div>
                    <Navbar />
                    <Dashboard />
                  </div>
                </PrivateRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <PrivateRoute>
                  <div>
                    <Navbar />
                    <Tasks />
                  </div>
                </PrivateRoute>
              }
            />
            <Route
              path="/users"
              element={
                <PrivateRoute>
                  <div>
                    <Navbar />
                    <Users />
                  </div>
                </PrivateRoute>
              }
            />
            <Route
              path="/invoices"
              element={
                <PrivateRoute>
                  <div>
                    <Navbar />
                    <Invoices />
                  </div>
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <div>
                    <Navbar />
                    <Profile />
                  </div>
                </PrivateRoute>
              }
            />
          </Routes>
          <ToastContainer 
            theme="automatic" // This will match system theme
            position="top-right" 
            autoClose={3000} 
          />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
