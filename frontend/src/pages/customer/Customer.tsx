import React, { useState, useEffect } from 'react';
import { Calendar, MessageSquare, Star, Phone, Mail, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Booking, Notification } from '../../types';
import { customerAPI } from '../../services/api';
import { format } from 'date-fns';

export const Customer: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'booking' | 'notifications' | 'feedback'>('booking');

  const [bookingForm, setBookingForm] = useState({
    customerName: '',
    email: '',
    phone: '',
    serviceType: '',
    preferredDate: '',
    vehicle: '',
    notes: ''
  });

  const [feedback, setFeedback] = useState({
    rating: 5,
    service: '',
    comments: ''
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const notificationsData = await customerAPI.getNotifications();
        setNotifications(notificationsData);
      } catch (error) {
        console.error('Failed to load customer data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createdBooking = await customerAPI.createBooking(bookingForm);
      setBookings(prev => [createdBooking, ...prev]);
      setBookingForm({
        customerName: '',
        email: '',
        phone: '',
        serviceType: '',
        preferredDate: '',
        vehicle: '',
        notes: ''
      });
      // Show success message
      alert('Booking request submitted successfully!');
    } catch (error) {
      console.error('Failed to create booking:', error);
      alert('Failed to submit booking. Please try again.');
    }
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock feedback submission
    alert('Thank you for your feedback!');
    setFeedback({
      rating: 5,
      service: '',
      comments: ''
    });
  };

  const serviceTypes = [
    'Oil Change',
    'Brake Service',
    'Tire Rotation',
    'Engine Diagnostics',
    'Transmission Service',
    'Air Conditioning',
    'General Maintenance',
    'Emergency Repair'
  ];

  const tabs = [
    { id: 'booking' as const, name: 'Service Booking', icon: Calendar },
    { id: 'notifications' as const, name: 'Notifications', icon: MessageSquare },
    { id: 'feedback' as const, name: 'Feedback', icon: Star }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Customer Portal</h1>
        <p className="text-gray-600 mt-2">Book services, view notifications, and provide feedback</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Service Booking Tab */}
      {activeTab === 'booking' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Book a Service</CardTitle>
            </CardHeader>
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  required
                  value={bookingForm.customerName}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, customerName: e.target.value }))}
                  placeholder="Enter your name"
                />
                <Input
                  label="Email"
                  type="email"
                  required
                  value={bookingForm.email}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                />
                <Input
                  label="Phone"
                  required
                  value={bookingForm.phone}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter your phone"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Type
                  </label>
                  <select
                    required
                    value={bookingForm.serviceType}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, serviceType: e.target.value }))}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select service type</option>
                    {serviceTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Preferred Date"
                  type="datetime-local"
                  required
                  value={bookingForm.preferredDate}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, preferredDate: e.target.value }))}
                />
                <Input
                  label="Vehicle"
                  required
                  value={bookingForm.vehicle}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, vehicle: e.target.value }))}
                  placeholder="Year Make Model"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  value={bookingForm.notes}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Any specific concerns or requirements?"
                />
              </div>
              <Button type="submit" className="w-full">
                <Calendar className="w-4 h-4 mr-2" />
                Submit Booking Request
              </Button>
            </form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Operating Hours</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              {[
                { day: 'Monday - Friday', hours: '8:00 AM - 6:00 PM' },
                { day: 'Saturday', hours: '9:00 AM - 4:00 PM' },
                { day: 'Sunday', hours: 'Closed' }
              ].map((schedule, index) => (
                <div key={index} className="flex justify-between items-center py-2">
                  <span className="font-medium text-gray-900">{schedule.day}</span>
                  <span className="text-gray-600">{schedule.hours}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-4">Contact Information</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">(555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">service@servicepro.com</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-l-4 ${
                    notification.type === 'success' ? 'border-green-500 bg-green-50' :
                    notification.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                    notification.type === 'error' ? 'border-red-500 bg-red-50' :
                    'border-blue-500 bg-blue-50'
                  } rounded-r-lg`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{notification.title}</h4>
                      <p className="text-gray-700 mt-1">{notification.message}</p>
                      <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{format(new Date(notification.createdAt), 'PPp')}</span>
                      </div>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No notifications at the moment</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Feedback Tab */}
      {activeTab === 'feedback' && (
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Service Feedback</CardTitle>
          </CardHeader>
          <form onSubmit={handleFeedbackSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Rating
              </label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFeedback(prev => ({ ...prev, rating: star }))}
                    className={`text-2xl ${
                      star <= feedback.rating ? 'text-yellow-400' : 'text-gray-300'
                    } hover:text-yellow-400 transition-colors duration-150`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Type
              </label>
              <select
                required
                value={feedback.service}
                onChange={(e) => setFeedback(prev => ({ ...prev, service: e.target.value }))}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select service received</option>
                {serviceTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comments
              </label>
              <textarea
                required
                value={feedback.comments}
                onChange={(e) => setFeedback(prev => ({ ...prev, comments: e.target.value }))}
                rows={4}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Please share your experience with our service..."
              />
            </div>

            <Button type="submit" className="w-full">
              <Star className="w-4 h-4 mr-2" />
              Submit Feedback
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
};