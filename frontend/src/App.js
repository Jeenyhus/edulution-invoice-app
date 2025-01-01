import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Users from './pages/Users';
import Invoices from './pages/Invoices';
import Navbar from './components/Navbar';
import Register from './pages/Register';

function App() {
  return (
    <AuthProvider>
      <Router>
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
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
