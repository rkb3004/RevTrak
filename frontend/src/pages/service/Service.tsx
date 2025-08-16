import React, { useState, useEffect } from 'react';
import { Plus, Eye, Clock, User, Wrench } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { JobCard } from '../../types';
import { serviceAPI } from '../../services/api';
import { format } from 'date-fns';

export const Service: React.FC = () => {
  const [jobCards, setJobCards] = useState<JobCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewJob, setShowNewJob] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobCard | null>(null);

  const [newJob, setNewJob] = useState({
    customerName: '',
    vehicle: '',
    services: '',
    assignedTechnician: '',
    estimatedCompletion: '',
    totalCost: 0
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const jobCardsData = await serviceAPI.getJobCards();
        setJobCards(jobCardsData);
      } catch (error) {
        console.error('Failed to load service data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createdJob = await serviceAPI.createJobCard({
        ...newJob,
        customerId: Date.now().toString(),
        services: newJob.services.split(',').map(s => s.trim())
      });
      setJobCards(prev => [createdJob, ...prev]);
      setShowNewJob(false);
      setNewJob({
        customerName: '',
        vehicle: '',
        services: '',
        assignedTechnician: '',
        estimatedCompletion: '',
        totalCost: 0
      });
    } catch (error) {
      console.error('Failed to create job card:', error);
    }
  };

  const getStatusBadge = (status: JobCard['status']) => {
    const variants: Record<JobCard['status'], 'default' | 'warning' | 'success' | 'error'> = {
      'pending': 'default',
      'in-progress': 'warning',
      'completed': 'success',
      'cancelled': 'error'
    };
    return <Badge variant={variants[status]}>{status.replace('-', ' ').toUpperCase()}</Badge>;
  };

  const jobColumns = [
    {
      key: 'customerName',
      title: 'Customer',
      render: (value: string, record: JobCard) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{record.vehicle}</p>
        </div>
      )
    },
    {
      key: 'services',
      title: 'Services',
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 2).map((service, idx) => (
            <Badge key={idx} variant="info" size="sm">{service}</Badge>
          ))}
          {value.length > 2 && (
            <Badge variant="default" size="sm">+{value.length - 2} more</Badge>
          )}
        </div>
      )
    },
    {
      key: 'assignedTechnician',
      title: 'Technician',
      render: (value: string) => (
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-gray-400" />
          <span>{value}</span>
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (value: JobCard['status']) => getStatusBadge(value)
    },
    {
      key: 'totalCost',
      title: 'Cost',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    {
      key: 'estimatedCompletion',
      title: 'Est. Completion',
      render: (value: string) => (
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>{format(new Date(value), 'MMM d, HH:mm')}</span>
        </div>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_: any, record: JobCard) => (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setSelectedJob(record)}
        >
          <Eye className="w-4 h-4" />
        </Button>
      )
    }
  ];

  const technicians = [
    { name: 'Mike Wilson', status: 'available', currentJobs: 2 },
    { name: 'Sarah Johnson', status: 'busy', currentJobs: 4 },
    { name: 'Tom Anderson', status: 'available', currentJobs: 1 },
    { name: 'Lisa Chen', status: 'break', currentJobs: 3 }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Service Management</h1>
          <p className="text-gray-600 mt-2">Manage job cards, schedules, and repair tracking</p>
        </div>
        <Button onClick={() => setShowNewJob(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Job Card
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Jobs</p>
              <p className="text-2xl font-bold text-gray-900">
                {jobCards.filter(j => j.status === 'in-progress').length}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {jobCards.filter(j => j.status === 'pending').length}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {jobCards.filter(j => j.status === 'completed').length}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue Today</p>
              <p className="text-2xl font-bold text-gray-900">
                ${jobCards
                  .filter(j => j.status === 'completed')
                  .reduce((sum, j) => sum + j.totalCost, 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Job Cards</CardTitle>
            </CardHeader>
            <Table
              data={jobCards}
              columns={jobColumns}
              loading={loading}
            />
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Technician Schedule</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              {technicians.map((tech, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      tech.status === 'available' ? 'bg-green-500' :
                      tech.status === 'busy' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-900">{tech.name}</p>
                      <p className="text-sm text-gray-500 capitalize">{tech.status}</p>
                    </div>
                  </div>
                  <Badge variant="default" size="sm">
                    {tech.currentJobs} jobs
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* New Job Modal */}
      <Modal
        isOpen={showNewJob}
        onClose={() => setShowNewJob(false)}
        title="Create New Job Card"
        size="lg"
      >
        <form onSubmit={handleCreateJob} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Customer Name"
              required
              value={newJob.customerName}
              onChange={(e) => setNewJob(prev => ({ ...prev, customerName: e.target.value }))}
            />
            <Input
              label="Vehicle"
              required
              value={newJob.vehicle}
              onChange={(e) => setNewJob(prev => ({ ...prev, vehicle: e.target.value }))}
              placeholder="Year Model - License Plate"
            />
            <Input
              label="Services"
              required
              value={newJob.services}
              onChange={(e) => setNewJob(prev => ({ ...prev, services: e.target.value }))}
              placeholder="Oil Change, Brake Inspection"
            />
            <Input
              label="Assigned Technician"
              required
              value={newJob.assignedTechnician}
              onChange={(e) => setNewJob(prev => ({ ...prev, assignedTechnician: e.target.value }))}
            />
            <Input
              label="Estimated Completion"
              type="datetime-local"
              required
              value={newJob.estimatedCompletion}
              onChange={(e) => setNewJob(prev => ({ ...prev, estimatedCompletion: e.target.value }))}
            />
            <Input
              label="Total Cost"
              type="number"
              required
              value={newJob.totalCost}
              onChange={(e) => setNewJob(prev => ({ ...prev, totalCost: parseInt(e.target.value) }))}
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => setShowNewJob(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Create Job Card
            </Button>
          </div>
        </form>
      </Modal>

      {/* Job Details Modal */}
      <Modal
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        title="Job Card Details"
        size="lg"
      >
        {selectedJob && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer</label>
                <p className="mt-1 text-sm text-gray-900">{selectedJob.customerName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <div className="mt-1">{getStatusBadge(selectedJob.status)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Vehicle</label>
                <p className="mt-1 text-sm text-gray-900">{selectedJob.vehicle}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Technician</label>
                <p className="mt-1 text-sm text-gray-900">{selectedJob.assignedTechnician}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Cost</label>
                <p className="mt-1 text-sm text-gray-900">${selectedJob.totalCost.toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Est. Completion</label>
                <p className="mt-1 text-sm text-gray-900">
                  {format(new Date(selectedJob.estimatedCompletion), 'PPP p')}
                </p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Services</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedJob.services.map((service, idx) => (
                  <Badge key={idx} variant="info">{service}</Badge>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button>
                <Wrench className="w-4 h-4 mr-2" />
                Update Status
              </Button>
              <Button variant="secondary">
                <Clock className="w-4 h-4 mr-2" />
                Reschedule
              </Button>
              <Button variant="outline">
                Print Job Card
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};