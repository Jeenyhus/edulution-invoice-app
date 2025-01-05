import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { reportService } from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Reports() {
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  
  const fetchReportData = async () => {
    try {
      setLoading(true);
      const data = await reportService.getReportData(timeRange);
      setReportData(data);
    } catch (error) {
      toast.error('Failed to fetch report data');
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [timeRange]);

  if (loading) {
    return <LoadingSpinner />;
  }

  // Cost Summary Component
  const CostSummary = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Cost Overview</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Total Cost</p>
          <p className="text-2xl font-bold">ZMW {reportData?.costSummary?.totalCost?.toFixed(2) || '0.00'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Average Cost/Hour</p>
          <p className="text-2xl font-bold">ZMW {reportData?.costSummary?.avgCostPerHour?.toFixed(2) || '0.00'}</p>
        </div>
      </div>
    </div>
  );

  // Time Distribution Chart
  const TimeDistribution = () => {
    const chartData = {
      labels: reportData?.categoryDistribution?.map(item => item.category) || [],
      datasets: [
        {
          label: 'Hours Worked',
          data: reportData?.categoryDistribution?.map(item => item.totalHours) || [],
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Hours by Category',
        },
      },
    };

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Hours by Category</h3>
        <Bar data={chartData} options={options} />
      </div>
    );
  };

  // User Performance Table
  const UserPerformance = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">User Performance</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hours Worked</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tasks Completed</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {reportData?.userPerformance?.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{user.hoursWorked?.toFixed(2) || '0.00'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{user.tasksCompleted}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">ZMW {user.totalCost?.toFixed(2) || '0.00'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h2>
        <select 
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="quarter">Last Quarter</option>
          <option value="year">Last Year</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CostSummary />
        <div className="lg:col-span-2">
          <TimeDistribution />
        </div>
        <div className="lg:col-span-3">
          <UserPerformance />
        </div>
      </div>
    </div>
  );
}

export default Reports; 