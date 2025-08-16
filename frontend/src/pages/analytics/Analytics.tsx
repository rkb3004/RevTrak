import React, { useEffect, useState, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, Users, DollarSign, Calendar, Star } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { analyticsAPI } from '../../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export const Analytics: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await analyticsAPI.getDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to load analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Sample data for charts
  const salesTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [65000, 78000, 82000, 75000, 90000, 95000],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Leads',
        data: [45, 52, 48, 61, 58, 67],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        yAxisID: 'y1',
      }
    ],
  };

  const serviceMetricsData = {
    labels: ['Oil Change', 'Brake Service', 'Tire Service', 'Engine Repair', 'Maintenance'],
    datasets: [
      {
        label: 'Jobs Completed',
        data: [45, 28, 32, 18, 25],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(139, 92, 246)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const customerSatisfactionData = {
    labels: ['Excellent', 'Good', 'Average', 'Poor'],
    datasets: [
      {
        data: [65, 25, 8, 2],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  const kpis = [
    {
      title: 'Total Revenue',
      value: `$${dashboardData?.salesMetrics.revenue.toLocaleString()}`,
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Active Customers',
      value: '1,247',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Conversion Rate',
      value: `${dashboardData?.salesMetrics.conversionRate}%`,
      change: '+2.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      title: 'Avg. Completion Time',
      value: `${dashboardData?.serviceMetrics.avgCompletionTime}h`,
      change: '-0.5h',
      trend: 'up',
      icon: Calendar,
      color: 'text-emerald-600'
    },
    {
      title: 'Customer Satisfaction',
      value: `${dashboardData?.serviceMetrics.customerSatisfaction}/5.0`,
      change: '+0.2',
      trend: 'up',
      icon: Star,
      color: 'text-yellow-600'
    },
    {
      title: 'Monthly Growth',
      value: '15.3%',
      change: '+3.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-indigo-600'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">Track performance metrics and business insights</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          const TrendIcon = kpi.trend === 'up' ? TrendingUp : TrendingDown;
          
          return (
            <Card key={index}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
                  <div className="flex items-center space-x-1 mt-2">
                    <TrendIcon className={`w-4 h-4 ${kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                    <span className={`text-sm font-medium ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {kpi.change}
                    </span>
                    <span className="text-sm text-gray-500">vs last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-gray-100`}>
                  <Icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Sales Performance</CardTitle>
          </CardHeader>
          <div className="h-80">
            <Line data={salesTrendData} options={chartOptions} />
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Breakdown</CardTitle>
          </CardHeader>
          <div className="h-80">
            <Bar data={serviceMetricsData} options={barChartOptions} />
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Satisfaction</CardTitle>
          </CardHeader>
          <div className="h-80 flex items-center justify-center">
            <div className="w-64 h-64">
              <Doughnut data={customerSatisfactionData} />
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Performance</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Revenue Target</p>
                <p className="text-sm text-gray-600">Monthly goal achieved</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">102%</p>
                <p className="text-sm text-green-600">+$12,000</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Customer Acquisition</p>
                <p className="text-sm text-gray-600">New customers this month</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-600">34</p>
                <p className="text-sm text-blue-600">+15% vs last month</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Service Efficiency</p>
                <p className="text-sm text-gray-600">Avg. turnaround time</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-yellow-600">3.2h</p>
                <p className="text-sm text-yellow-600">-0.8h improvement</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};