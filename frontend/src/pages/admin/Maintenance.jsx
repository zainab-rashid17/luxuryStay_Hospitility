import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext.jsx';
import AdminLayout from '../../components/AdminLayout.jsx';

const Maintenance = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    roomId: '',
    issueType: 'other',
    description: '',
    priority: 'medium'
  });
  const [filter, setFilter] = useState({ status: '', issueType: '' });
  const [stats, setStats] = useState({
    total: 0,
    reported: 0,
    inProgress: 0,
    resolved: 0
  });

  useEffect(() => {
    fetchRequests();
    fetchRooms();
  }, [filter]);

  const fetchRequests = async () => {
    try {
      const params = {};
      if (filter.status) params.status = filter.status;
      if (filter.issueType) params.issueType = filter.issueType;
      
      const response = await axios.get('/api/maintenance', { params });
      const allRequests = response.data.requests || [];
      setRequests(allRequests);
      
      // Calculate stats
      setStats({
        total: allRequests.length,
        reported: allRequests.filter(r => r.status === 'reported').length,
        inProgress: allRequests.filter(r => r.status === 'in-progress').length,
        resolved: allRequests.filter(r => r.status === 'resolved').length
      });
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await axios.get('/api/rooms');
      setRooms(response.data.rooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/maintenance', formData);
      setShowForm(false);
      setFormData({
        roomId: '',
        issueType: 'other',
        description: '',
        priority: 'medium'
      });
      fetchRequests();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating request');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`/api/maintenance/${id}`, { status });
      fetchRequests();
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating request');
    }
  };

  return (
    <AdminLayout title="Maintenance" subtitle="Log and resolve maintenance issues quickly">
      {/* Stats Cards */}
      <div className="grid grid-4 mb-3">
        <div className="card">
          <h3>Total Requests</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#6d4c41' }}>{stats.total}</p>
          <span style={{ fontSize: '12px', color: '#8d6e63' }}>All maintenance requests</span>
        </div>
        <div className="card">
          <h3>Reported</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#a1887f' }}>{stats.reported}</p>
          <span style={{ fontSize: '12px', color: '#8d6e63' }}>Awaiting assignment</span>
        </div>
        <div className="card">
          <h3>In Progress</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffb74d' }}>{stats.inProgress}</p>
          <span style={{ fontSize: '12px', color: '#8d6e63' }}>Currently being fixed</span>
        </div>
        <div className="card">
          <h3>Resolved</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffcc80' }}>{stats.resolved}</p>
          <span style={{ fontSize: '12px', color: '#8d6e63' }}>Completed this period</span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="card" style={{ marginBottom: '20px', padding: '16px 24px' }}>
        <div className="page-header" style={{ flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                border: '1px solid #d7ccc8',
                fontSize: '14px',
                background: '#fffaf5',
                color: '#4e342e',
                cursor: 'pointer',
                minWidth: '150px'
              }}
            >
              <option value="">All Status</option>
              <option value="reported">Reported</option>
              <option value="assigned">Assigned</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={filter.issueType}
              onChange={(e) => setFilter({ ...filter, issueType: e.target.value })}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                border: '1px solid #d7ccc8',
                fontSize: '14px',
                background: '#fffaf5',
                color: '#4e342e',
                cursor: 'pointer',
                minWidth: '150px'
              }}
            >
              <option value="">All Types</option>
              <option value="plumbing">Plumbing</option>
              <option value="electrical">Electrical</option>
              <option value="hvac">HVAC</option>
              <option value="furniture">Furniture</option>
              <option value="appliance">Appliance</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button 
            className="btn btn-primary" 
            onClick={() => setShowForm(!showForm)}
            style={{ 
              padding: '10px 24px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '14px'
            }}
          >
            {showForm ? '✕ Cancel' : '+ New Request'}
          </button>
        </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: '20px', animation: 'fadeIn 0.3s ease' }}>
          <h2 style={{ color: '#4e342e', marginBottom: '20px', fontSize: '1.5rem' }}>Create Maintenance Request</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label>Room</label>
                <select
                  value={formData.roomId}
                  onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                  required
                >
                  <option value="">Select Room</option>
                  {rooms.map(room => (
                    <option key={room._id} value={room._id}>
                      {room.roomNumber} - {room.roomType}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Issue Type</label>
                <select
                  value={formData.issueType}
                  onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
                  required
                >
                  <option value="plumbing">Plumbing</option>
                  <option value="electrical">Electrical</option>
                  <option value="hvac">HVAC</option>
                  <option value="furniture">Furniture</option>
                  <option value="appliance">Appliance</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                placeholder="Describe the maintenance issue in detail..."
                rows="4"
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '12px 32px', fontSize: '15px', fontWeight: 600 }}>
              Submit Request
            </button>
          </form>
        </div>
      )}

      {/* Requests Table */}
      <div className="card">
        <h2 style={{ color: '#4e342e', marginBottom: '20px', fontSize: '1.5rem' }}>Maintenance Requests</h2>
        {requests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#8d6e63' }}>
            <p style={{ fontSize: '18px', marginBottom: '10px' }}>No maintenance requests found</p>
            <p style={{ fontSize: '14px' }}>Create a new request to get started</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Room</th>
                  <th>Issue Type</th>
                  <th>Description</th>
                  <th>Priority</th>
                  <th>Reported By</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(request => (
                  <tr key={request._id}>
                    <td style={{ fontWeight: 600, color: '#4e342e' }}>
                      {request.roomId?.roomNumber} - {request.roomId?.roomType}
                    </td>
                    <td>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 600,
                        textTransform: 'capitalize',
                        background: 'linear-gradient(135deg, #ffe0b2 0%, #ffcc80 100%)',
                        color: '#4e342e'
                      }}>
                        {request.issueType}
                      </span>
                    </td>
                    <td style={{ maxWidth: '300px', wordWrap: 'break-word' }}>{request.description}</td>
                    <td>
                      <span className={`badge ${
                        request.priority === 'urgent' ? 'badge-danger' :
                        request.priority === 'high' ? 'badge-warning' :
                        'badge-info'
                      }`}>
                        {request.priority}
                      </span>
                    </td>
                    <td>{request.reportedBy?.firstName} {request.reportedBy?.lastName}</td>
                    <td>
                      <span className={`badge ${
                        request.status === 'resolved' ? 'badge-success' :
                        request.status === 'in-progress' ? 'badge-info' :
                        request.status === 'cancelled' ? 'badge-danger' :
                        'badge-warning'
                      }`}>
                        {request.status}
                      </span>
                    </td>
                    <td>
                      <select
                        value={request.status}
                        onChange={(e) => handleStatusUpdate(request._id, e.target.value)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: '1px solid #d7ccc8',
                          background: '#fffaf5',
                          color: '#4e342e',
                          fontSize: '13px',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="reported">Reported</option>
                        <option value="assigned">Assigned</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Maintenance;

