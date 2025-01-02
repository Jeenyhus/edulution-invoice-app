import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Users from './pages/Users';
import Invoices from './pages/Invoices';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import { useEffect } from 'react';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
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
                <div>
                  <Navbar />
                  <Tasks />
                </div>
              }
            />
            <Route
              path="/users"
              element={
                <div>
                  <Navbar />
                  <Users />
                </div>
              }
            />
            <Route
              path="/invoices"
              element={
                <div>
                  <Navbar />
                  <Invoices />
                </div>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

// PrivateRoute component to protect routes
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? children : null;
};

export default App;
