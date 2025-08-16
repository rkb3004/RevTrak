export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'sales' | 'service' | 'customer';
  avatar?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed' | 'lost';
  source: string;
  interestedVehicle: string;
  budget: number;
  createdAt: string;
  assignedTo?: string;
}

export interface TestDrive {
  id: string;
  customerId: string;
  customerName: string;
  vehicle: string;
  scheduledDate: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface JobCard {
  id: string;
  customerId: string;
  customerName: string;
  vehicle: string;
  services: string[];
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  assignedTechnician: string;
  estimatedCompletion: string;
  totalCost: number;
  createdAt: string;
}

export interface SparePart {
  id: string;
  name: string;
  partNumber: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  supplier: string;
  location: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Booking {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  serviceType: string;
  preferredDate: string;
  vehicle: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed';
}