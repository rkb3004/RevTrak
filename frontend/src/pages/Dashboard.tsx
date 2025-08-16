import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Wrench, 
  Package, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  DollarSign
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { analyticsAPI } from '../services/api';

interface DashboardData {
  salesMetrics: {
    totalLeads: number;
    convertedLeads: number;
    conversionRate: number;
    revenue: number;
  };
  serviceMetrics: {
    activeJobs: number;
    completedToday: number;
    avgCompletionTime: number;
    customerSatisfaction: number;
  };
  inventoryMetrics: {
    totalParts: number;
    lowStockItems: number;
    totalValue: number;
    reorderNeeded: number;
  };
}

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const dashboardData = await analyticsAPI.getDashboardData();
        setData(dashboardData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-24 bg-gray-200 rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Leads',
      value: data?.salesMetrics.totalLeads || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Active Jobs',
      value: data?.serviceMetrics.activeJobs || 0,
      icon: Wrench,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    },
    {
      title: 'Revenue',
      value: `$${(data?.salesMetrics.revenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Low Stock Items',
      value: data?.inventoryMetrics.lowStockItems || 0,
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Conversion Rate',
      value: `${data?.salesMetrics.conversionRate || 0}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Completed Today',
      value: data?.serviceMetrics.completedToday || 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Avg. Completion',
      value: `${data?.serviceMetrics.avgCompletionTime || 0}h`,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Total Parts',
      value: data?.inventoryMetrics.totalParts || 0,
      icon: Package,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your business.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">New lead: John Smith interested in Model X</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Service completed: Oil change for ABC123</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Low stock alert: Brake pads need reordering</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Test drive scheduled for tomorrow</span>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <Users className="w-6 h-6 text-blue-600 mb-2" />
              <p className="font-medium text-gray-900">Add Lead</p>
              <p className="text-sm text-gray-600">Create new sales lead</p>
            </button>
            <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <Wrench className="w-6 h-6 text-emerald-600 mb-2" />
              <p className="font-medium text-gray-900">New Job Card</p>
              <p className="text-sm text-gray-600">Create service job</p>
            </button>
            <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <Package className="w-6 h-6 text-purple-600 mb-2" />
              <p className="font-medium text-gray-900">Check Stock</p>
              <p className="text-sm text-gray-600">View inventory</p>
            </button>
            <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <TrendingUp className="w-6 h-6 text-green-600 mb-2" />
              <p className="font-medium text-gray-900">View Reports</p>
              <p className="text-sm text-gray-600">Analytics dashboard</p>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};