import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout.jsx';

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('roomRates');
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/api/settings');
      setSettings(response.data.settings);
      setFormData(response.data.settings);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setLoading(false);
    }
  };

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/settings', formData);
      setMessage('Settings updated successfully!');
      setTimeout(() => setMessage(''), 3000);
      fetchSettings();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error updating settings');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <AdminLayout title="Settings" subtitle="Configure pricing, policies, notifications and integrations">
      <div style={{ marginBottom: '20px' }}>
        <h2>System Settings</h2>
        <p style={{ color: '#666' }}>Configure hotel settings, rates, taxes, and policies</p>
      </div>

      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`} style={{ marginBottom: '20px' }}>
          {message}
        </div>
      )}

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <button
          className={`btn ${activeTab === 'roomRates' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('roomRates')}
        >
          Room Rates
        </button>
        <button
          className={`btn ${activeTab === 'taxSettings' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('taxSettings')}
        >
          Tax Settings
        </button>
        <button
          className={`btn ${activeTab === 'policies' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('policies')}
        >
          Policies
        </button>
        <button
          className={`btn ${activeTab === 'hotelInfo' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('hotelInfo')}
        >
          Hotel Info
        </button>
        <button
          className={`btn ${activeTab === 'emailSettings' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('emailSettings')}
        >
          Email Settings
        </button>
        <button
          className={`btn ${activeTab === 'notifications' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card">
          {activeTab === 'roomRates' && (
            <div>
              <h2>Room Rates Configuration</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
                <div className="form-group">
                  <label>Single Room Rate ($)</label>
                  <input
                    type="number"
                    value={formData.roomRates?.Single || ''}
                    onChange={(e) => handleChange('roomRates', 'Single', parseFloat(e.target.value))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Double Room Rate ($)</label>
                  <input
                    type="number"
                    value={formData.roomRates?.Double || ''}
                    onChange={(e) => handleChange('roomRates', 'Double', parseFloat(e.target.value))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Suite Rate ($)</label>
                  <input
                    type="number"
                    value={formData.roomRates?.Suite || ''}
                    onChange={(e) => handleChange('roomRates', 'Suite', parseFloat(e.target.value))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Deluxe Rate ($)</label>
                  <input
                    type="number"
                    value={formData.roomRates?.Deluxe || ''}
                    onChange={(e) => handleChange('roomRates', 'Deluxe', parseFloat(e.target.value))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Presidential Rate ($)</label>
                  <input
                    type="number"
                    value={formData.roomRates?.Presidential || ''}
                    onChange={(e) => handleChange('roomRates', 'Presidential', parseFloat(e.target.value))}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'taxSettings' && (
            <div>
              <h2>Tax Configuration</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
                <div className="form-group">
                  <label>Service Tax (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.taxSettings?.serviceTax || ''}
                    onChange={(e) => handleChange('taxSettings', 'serviceTax', parseFloat(e.target.value))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>GST (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.taxSettings?.gst || ''}
                    onChange={(e) => handleChange('taxSettings', 'gst', parseFloat(e.target.value))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>City Tax (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.taxSettings?.cityTax || ''}
                    onChange={(e) => handleChange('taxSettings', 'cityTax', parseFloat(e.target.value))}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'policies' && (
            <div>
              <h2>Hotel Policies</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', marginTop: '20px' }}>
                <div className="form-group">
                  <label>Cancellation Policy</label>
                  <textarea
                    value={formData.policies?.cancellationPolicy || ''}
                    onChange={(e) => handleChange('policies', 'cancellationPolicy', e.target.value)}
                    rows="3"
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label>Check-in Time</label>
                    <input
                      type="time"
                      value={formData.policies?.checkInTime || ''}
                      onChange={(e) => handleChange('policies', 'checkInTime', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Check-out Time</label>
                    <input
                      type="time"
                      value={formData.policies?.checkOutTime || ''}
                      onChange={(e) => handleChange('policies', 'checkOutTime', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Pet Policy</label>
                  <input
                    type="text"
                    value={formData.policies?.petPolicy || ''}
                    onChange={(e) => handleChange('policies', 'petPolicy', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Smoking Policy</label>
                  <input
                    type="text"
                    value={formData.policies?.smokingPolicy || ''}
                    onChange={(e) => handleChange('policies', 'smokingPolicy', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hotelInfo' && (
            <div>
              <h2>Hotel Information</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
                <div className="form-group">
                  <label>Hotel Name</label>
                  <input
                    type="text"
                    value={formData.hotelInfo?.name || ''}
                    onChange={(e) => handleChange('hotelInfo', 'name', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    value={formData.hotelInfo?.phone || ''}
                    onChange={(e) => handleChange('hotelInfo', 'phone', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.hotelInfo?.email || ''}
                    onChange={(e) => handleChange('hotelInfo', 'email', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Website</label>
                  <input
                    type="url"
                    value={formData.hotelInfo?.website || ''}
                    onChange={(e) => handleChange('hotelInfo', 'website', e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Address</label>
                  <textarea
                    value={formData.hotelInfo?.address || ''}
                    onChange={(e) => handleChange('hotelInfo', 'address', e.target.value)}
                    rows="2"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'emailSettings' && (
            <div>
              <h2>Email Configuration</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
                <div className="form-group">
                  <label>SMTP Host</label>
                  <input
                    type="text"
                    value={formData.emailSettings?.smtpHost || ''}
                    onChange={(e) => handleChange('emailSettings', 'smtpHost', e.target.value)}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div className="form-group">
                  <label>SMTP Port</label>
                  <input
                    type="number"
                    value={formData.emailSettings?.smtpPort || ''}
                    onChange={(e) => handleChange('emailSettings', 'smtpPort', parseInt(e.target.value))}
                    placeholder="587"
                  />
                </div>
                <div className="form-group">
                  <label>SMTP Username</label>
                  <input
                    type="text"
                    value={formData.emailSettings?.smtpUser || ''}
                    onChange={(e) => handleChange('emailSettings', 'smtpUser', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>SMTP Password</label>
                  <input
                    type="password"
                    value={formData.emailSettings?.smtpPassword || ''}
                    onChange={(e) => handleChange('emailSettings', 'smtpPassword', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>From Email</label>
                  <input
                    type="email"
                    value={formData.emailSettings?.fromEmail || ''}
                    onChange={(e) => handleChange('emailSettings', 'fromEmail', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>From Name</label>
                  <input
                    type="text"
                    value={formData.emailSettings?.fromName || ''}
                    onChange={(e) => handleChange('emailSettings', 'fromName', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h2>Notification Settings</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.notificationSettings?.emailNotifications || false}
                      onChange={(e) => handleChange('notificationSettings', 'emailNotifications', e.target.checked)}
                    />
                    Enable Email Notifications
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.notificationSettings?.smsNotifications || false}
                      onChange={(e) => handleChange('notificationSettings', 'smsNotifications', e.target.checked)}
                    />
                    Enable SMS Notifications
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.notificationSettings?.notifyOnBooking || false}
                      onChange={(e) => handleChange('notificationSettings', 'notifyOnBooking', e.target.checked)}
                    />
                    Notify on New Booking
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.notificationSettings?.notifyOnCheckIn || false}
                      onChange={(e) => handleChange('notificationSettings', 'notifyOnCheckIn', e.target.checked)}
                    />
                    Notify on Check-in
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.notificationSettings?.notifyOnCheckOut || false}
                      onChange={(e) => handleChange('notificationSettings', 'notifyOnCheckOut', e.target.checked)}
                    />
                    Notify on Check-out
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.notificationSettings?.notifyOnMaintenance || false}
                      onChange={(e) => handleChange('notificationSettings', 'notifyOnMaintenance', e.target.checked)}
                    />
                    Notify on Maintenance Request
                  </label>
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-primary">Save Settings</button>
            <button type="button" className="btn btn-secondary" onClick={fetchSettings}>Reset</button>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

export default Settings;

