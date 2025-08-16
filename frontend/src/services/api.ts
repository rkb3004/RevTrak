
import { apiFetch } from '../api';
// Import Lead type (adjust the path as needed)
import type { Lead, User, TestDrive, JobCard, SparePart, Booking } from '../types';

export const authAPI = {
  async login(email: string, password: string) {
    const res = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    return res;
  },
  async signup(name: string, email: string, password: string) {
    const res = await apiFetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role: 'customer' })
    });
    return res;
  },
  async verifyToken(): Promise<User | null> {
    try {
      const res = await apiFetch('/api/users/me');
      return res;
    } catch {
      return null;
    }
  }
};

export const salesAPI = {
  async getLeads(): Promise<Lead[]> {
    return apiFetch('/api/sales/leads');
  },
  async createLead(lead: Partial<Lead>): Promise<Lead> {
    return apiFetch('/api/sales/leads', {
      method: 'POST',
      body: JSON.stringify(lead)
    });
  },
  async getTestDrives(): Promise<TestDrive[]> {
    return apiFetch('/api/sales/test-drives');
  }
};

export const serviceAPI = {
  async getJobCards(): Promise<JobCard[]> {
    return apiFetch('/api/service/job-cards');
  },
  async createJobCard(jobCard: Partial<JobCard>): Promise<JobCard> {
    return apiFetch('/api/service/job-cards', {
      method: 'POST',
      body: JSON.stringify(jobCard)
    });
  }
};

export const inventoryAPI = {
  async getSpareParts(): Promise<SparePart[]> {
    return apiFetch('/api/inventory/parts');
  },
  async updateStock(partId: string, quantity: number): Promise<void> {
    return apiFetch(`/api/inventory/parts/${partId}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity })
    });
  }
};

export const customerAPI = {
  async createBooking(booking: Partial<Booking>): Promise<Booking> {
    return apiFetch('/api/customers/bookings', {
      method: 'POST',
      body: JSON.stringify(booking)
    });
  },
  async getNotifications(): Promise<Notification[]> {
    return apiFetch('/api/customers/notifications');
  }
};

export const analyticsAPI = {
  async getDashboardData() {
    return apiFetch('/api/analytics/dashboard');
  }
};