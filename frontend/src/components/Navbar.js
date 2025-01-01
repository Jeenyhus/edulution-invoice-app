import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              Invoice App
            </Link>
          </div>
          
          <div className="flex space-x-4">
            <Link to="/tasks" className="text-gray-600 hover:text-gray-900">
              Tasks
            </Link>
            <Link to="/users" className="text-gray-600 hover:text-gray-900">
              Users
            </Link>
            <Link to="/invoices" className="text-gray-600 hover:text-gray-900">
              Invoices
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 