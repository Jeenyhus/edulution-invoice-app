import { useState } from 'react';
import { invoiceService } from '../services/api';

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
      const response = await invoiceService.generateInvoice(
        dateRange.startDate,
        dateRange.endDate
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0072cd]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-semibold text-black mb-2">Generate Invoice</h1>
          <p className="text-gray-600">Select a date range to generate your invoice</p>
        </div>

        {/* Main Card */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 sm:p-8">
          {/* Date Range Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#0072cd] focus:ring-1 focus:ring-[#0072cd] outline-none transition-all"
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
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#0072cd] focus:ring-1 focus:ring-[#0072cd] outline-none transition-all"
              />
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateInvoice}
            disabled={generating}
            className="w-full bg-[#0072cd] text-white rounded-lg px-4 py-3 font-medium transition-all hover:bg-[#005ba3] disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* Instructions */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-sm font-medium text-gray-700 mb-4">Instructions</h2>
            <ol className="space-y-3">
              {[
                "Select your desired start date",
                "Choose the end date for your invoice period",
                "Click generate to download your invoice as Excel file"
              ].map((text, index) => (
                <li key={index} className="flex items-center text-sm text-gray-600">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0072cd] text-white flex items-center justify-center text-xs mr-3">
                    {index + 1}
                  </span>
                  {text}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Invoices; 