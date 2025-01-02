import { useState, useEffect } from 'react';
import { userService, invoiceService } from '../services/api';

function Invoices() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userService.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Unable to load users. Please refresh the page or try again later.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInvoice = async () => {
    if (!selectedUser || !dateRange.startDate || !dateRange.endDate) {
      alert('Please select a user and date range');
      return;
    }

    setGenerating(true);
    try {
      const response = await invoiceService.generateInvoice(
        selectedUser,
        dateRange.startDate,
        dateRange.endDate
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${dateRange.startDate}-to-${dateRange.endDate}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('Error generating invoice. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8 md:px-8 md:py-10">
            <h1 className="text-2xl font-bold text-white mb-2">Invoice Generator</h1>
            <p className="text-gray-300">
              Generate detailed invoices for your tasks within a specific date range.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Generate Invoice</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select User
                  </label>
                  <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="w-full rounded-lg border-gray-200 bg-white px-4 py-2.5 text-gray-900 shadow-sm hover:border-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  >
                    <option value="">Choose a user</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full rounded-lg border-gray-200 bg-white px-4 py-2.5 text-gray-900 shadow-sm hover:border-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full rounded-lg border-gray-200 bg-white px-4 py-2.5 text-gray-900 shadow-sm hover:border-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <button
                    onClick={handleGenerateInvoice}
                    disabled={generating}
                    className="inline-flex items-center px-6 py-3 text-sm font-medium rounded-lg text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {generating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Generate Invoice
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions Card */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Instructions</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4 text-gray-600">
                <div className="flex items-start">
                  <span className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 text-gray-900 text-sm font-medium mr-3">1</span>
                  <p>Select a user from the dropdown menu</p>
                </div>
                <div className="flex items-start">
                  <span className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 text-gray-900 text-sm font-medium mr-3">2</span>
                  <p>Choose the start and end dates for the invoice period</p>
                </div>
                <div className="flex items-start">
                  <span className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 text-gray-900 text-sm font-medium mr-3">3</span>
                  <p>Click "Generate Invoice" to create and download the Excel file</p>
                </div>
                <div className="flex items-start">
                  <span className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 text-gray-900 text-sm font-medium mr-3">4</span>
                  <p>The generated invoice will include all tasks within the selected date range</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Invoices; 