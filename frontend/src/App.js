import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Users from './pages/Users';
import Invoices from './pages/Invoices';
import Navbar from './components/Navbar';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <div>
                <Navbar />
                <Dashboard />
              </div>
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
    </Router>
  );
}

export default App;
