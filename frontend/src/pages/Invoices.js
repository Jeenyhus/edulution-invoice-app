import { useState } from 'react';
import { invoiceService } from '../services/invoiceService';

function Invoices() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [generating, setGenerating] = useState(false);

  const handleGenerateInvoice = async () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      alert('Please select a date range');
      return;
    }

    setGenerating(true);
    try {
      const token = localStorage.getItem('token'); // Ensure the token is retrieved from local storage
      const response = await invoiceService.generateInvoice(
        dateRange.startDate,
        dateRange.endDate,
        token
      );

      // Ensure we're getting the blob data correctly
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${dateRange.startDate}-to-${dateRange.endDate}.xlsx`);
      
      // Append to document, click, and cleanup
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('Error generating invoice. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  if (generating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0072cd]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Hero Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="relative p-8">
            <div className="max-w-3xl">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Generate Invoice</h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Select a date range to generate your invoice
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Date Range Form */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Date Range</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-[#0072cd] dark:focus:border-[#0072cd] focus:ring-1 focus:ring-[#0072cd] dark:focus:ring-[#0072cd] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-[#0072cd] dark:focus:border-[#0072cd] focus:ring-1 focus:ring-[#0072cd] dark:focus:ring-[#0072cd] outline-none transition-all"
                  />
                </div>
              </div>

              <button
                onClick={handleGenerateInvoice}
                disabled={generating}
                className="w-full bg-[#0072cd] text-white rounded-xl px-4 py-3 font-medium transition-all hover:bg-[#005ba3] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? (
                  <div className="flex items-center justify-center">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span className="ml-2">Generating...</span>
                  </div>
                ) : (
                  "Generate Invoice"
                )}
              </button>
            </div>
          </div>

          {/* Instructions Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Instructions</h2>
              <div className="space-y-4">
                {[
                  {
                    title: "Select Start Date",
                    description: "Choose the beginning date for your invoice period"
                  },
                  {
                    title: "Choose End Date",
                    description: "Select the last date to include in your invoice"
                  },
                  {
                    title: "Generate",
                    description: "Click generate to download your invoice as Excel file"
                  }
                ].map((step, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-primary-DEFAULT/10 dark:bg-primary-DEFAULT/20 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-DEFAULT">{index + 1}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{step.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Invoices;