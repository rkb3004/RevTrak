import React, { useState, useEffect } from 'react';
import { Plus, Eye, Phone, Mail, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Lead, TestDrive } from '../../types';
import { salesAPI } from '../../services/api';
import { format } from 'date-fns';

export const Sales: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [testDrives, setTestDrives] = useState<TestDrive[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewLead, setShowNewLead] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    source: '',
    interestedVehicle: '',
    budget: 0
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [leadsData, testDrivesData] = await Promise.all([
          salesAPI.getLeads(),
          salesAPI.getTestDrives()
        ]);
        setLeads(leadsData);
        setTestDrives(testDrivesData);
      } catch (error) {
        console.error('Failed to load sales data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createdLead = await salesAPI.createLead(newLead);
      setLeads(prev => [createdLead, ...prev]);
      setShowNewLead(false);
      setNewLead({
        name: '',
        email: '',
        phone: '',
        source: '',
        interestedVehicle: '',
        budget: 0
      });
    } catch (error) {
      console.error('Failed to create lead:', error);
    }
  };

  const getStatusBadge = (status: Lead['status']) => {
    const variants: Record<Lead['status'], 'default' | 'info' | 'warning' | 'success' | 'error'> = {
      'new': 'info',
      'contacted': 'default',
      'qualified': 'warning',
      'proposal': 'warning',
      'closed': 'success',
      'lost': 'error'
    };
    return <Badge variant={variants[status]}>{status.toUpperCase()}</Badge>;
  };

  const leadColumns = [
    {
      key: 'name',
      title: 'Name',
      render: (value: string, record: Lead) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{record.email}</p>
        </div>
      )
    },
    {
      key: 'phone',
      title: 'Contact',
      render: (value: string, record: Lead) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm">
            <Phone className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Mail className="w-4 h-4" />
          </Button>
        </div>
      )
    },
    {
      key: 'interestedVehicle',
      title: 'Vehicle Interest'
    },
    {
      key: 'budget',
      title: 'Budget',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    {
      key: 'status',
      title: 'Status',
      render: (value: Lead['status']) => getStatusBadge(value)
    },
    {
      key: 'createdAt',
      title: 'Created',
      render: (value: string) => format(new Date(value), 'MMM d, yyyy')
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_: any, record: Lead) => (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setSelectedLead(record)}
        >
          <Eye className="w-4 h-4" />
        </Button>
      )
    }
  ];

  const testDriveColumns = [
    {
      key: 'customerName',
      title: 'Customer'
    },
    {
      key: 'vehicle',
      title: 'Vehicle'
    },
    {
      key: 'scheduledDate',
      title: 'Scheduled Date',
      render: (value: string) => format(new Date(value), 'MMM d, yyyy HH:mm')
    },
    {
      key: 'status',
      title: 'Status',
      render: (value: TestDrive['status']) => {
        const variants: Record<TestDrive['status'], 'default' | 'warning' | 'success' | 'error'> = {
          'scheduled': 'warning',
          'completed': 'success',
          'cancelled': 'error'
        };
        return <Badge variant={variants[value]}>{value.toUpperCase()}</Badge>;
      }
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Management</h1>
          <p className="text-gray-600 mt-2">Manage leads, test drives, and financing</p>
        </div>
        <Button onClick={() => setShowNewLead(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Lead
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">{leads.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Qualified</p>
              <p className="text-2xl font-bold text-gray-900">
                {leads.filter(l => l.status === 'qualified').length}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Closed</p>
              <p className="text-2xl font-bold text-gray-900">
                {leads.filter(l => l.status === 'closed').length}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Test Drives</p>
              <p className="text-2xl font-bold text-gray-900">{testDrives.length}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lead Tracking</CardTitle>
        </CardHeader>
        <Table
          data={leads}
          columns={leadColumns}
          loading={loading}
        />
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Drive Schedule</CardTitle>
        </CardHeader>
        <Table
          data={testDrives}
          columns={testDriveColumns}
          loading={loading}
        />
      </Card>

      {/* New Lead Modal */}
      <Modal
        isOpen={showNewLead}
        onClose={() => setShowNewLead(false)}
        title="Create New Lead"
        size="lg"
      >
        <form onSubmit={handleCreateLead} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              required
              value={newLead.name}
              onChange={(e) => setNewLead(prev => ({ ...prev, name: e.target.value }))}
            />
            <Input
              label="Email"
              type="email"
              required
              value={newLead.email}
              onChange={(e) => setNewLead(prev => ({ ...prev, email: e.target.value }))}
            />
            <Input
              label="Phone"
              required
              value={newLead.phone}
              onChange={(e) => setNewLead(prev => ({ ...prev, phone: e.target.value }))}
            />
            <Input
              label="Source"
              required
              value={newLead.source}
              onChange={(e) => setNewLead(prev => ({ ...prev, source: e.target.value }))}
            />
            <Input
              label="Interested Vehicle"
              required
              value={newLead.interestedVehicle}
              onChange={(e) => setNewLead(prev => ({ ...prev, interestedVehicle: e.target.value }))}
            />
            <Input
              label="Budget"
              type="number"
              required
              value={newLead.budget}
              onChange={(e) => setNewLead(prev => ({ ...prev, budget: parseInt(e.target.value) }))}
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => setShowNewLead(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Create Lead
            </Button>
          </div>
        </form>
      </Modal>

      {/* Lead Details Modal */}
      <Modal
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        title="Lead Details"
        size="lg"
      >
        {selectedLead && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-sm text-gray-900">{selectedLead.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <div className="mt-1">{getStatusBadge(selectedLead.status)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{selectedLead.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <p className="mt-1 text-sm text-gray-900">{selectedLead.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Vehicle Interest</label>
                <p className="mt-1 text-sm text-gray-900">{selectedLead.interestedVehicle}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Budget</label>
                <p className="mt-1 text-sm text-gray-900">${selectedLead.budget.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button>
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Test Drive
              </Button>
              <Button variant="secondary">
                <Phone className="w-4 h-4 mr-2" />
                Call Customer
              </Button>
              <Button variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};