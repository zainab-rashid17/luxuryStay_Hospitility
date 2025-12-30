import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext.jsx';
import GuestFooter from '../../components/GuestFooter.jsx';

const Reservations = () => {
  const { user } = useContext(AuthContext);
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    roomId: '',
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    specialRequests: ''
  });
  const [filter, setFilter] = useState({ status: '' });

  useEffect(() => {
    fetchReservations();
    fetchAvailableRooms();
  }, [filter]);

  const fetchReservations = async () => {
    try {
      const params = { guestId: user?._id };
      if (filter.status) params.status = filter.status;

      const response = await axios.get('/api/reservations', { params });
      setReservations(response.data.reservations);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableRooms = async () => {
    try {
      const response = await axios.get('/api/rooms', { params: { status: 'available' } });
      setRooms(response.data.rooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure dates are in correct format
      const submitData = {
        ...formData,
        checkInDate: formData.checkInDate, // Should already be YYYY-MM-DD format
        checkOutDate: formData.checkOutDate // Should already be YYYY-MM-DD format
      };

      const response = await axios.post('/api/reservations', submitData);

      if (response.data.success) {
        setShowForm(false);
        setFormData({
          roomId: '',
          checkInDate: '',
          checkOutDate: '',
          numberOfGuests: 1,
          specialRequests: ''
        });
        fetchReservations();
        fetchAvailableRooms();
        alert('Reservation created successfully!');
      }
    } catch (error) {
      console.error('Reservation creation error:', error);
      let errorMessage = 'Error creating reservation';

      if (error.response?.data) {
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.errors) {
          errorMessage = error.response.data.errors.map((e) => e.msg || e).join(', ');
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(errorMessage);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      try {
        await axios.put(`/api/reservations/${id}`, { status: 'cancelled' });
        fetchReservations();
      } catch (error) {
        alert(error.response?.data?.message || 'Error cancelling reservation');
      }
    }
  };

  const handleDownloadBill = async (reservationId) => {
    try {
      // Find the bill associated with this reservation
      const billingResponse = await axios.get('/api/billing', {
        params: { reservationId: reservationId }
      });

      const bills = billingResponse.data.bills;
      if (!bills || bills.length === 0) {
        alert('Bill not generated yet. Please wait a moment or contact support.');
        return;
      }

      const bill = bills[0]; // Assuming one bill per reservation for now

      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/billing/${bill._id}/pdf`, {
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${bill.invoiceNumber || bill._id}.pdf`);
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        link.remove();
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Error downloading bill:', error);
      alert('Failed to download bill. It might not be generated yet.');
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  const confirmedCount = reservations.filter(r => r.status === 'confirmed').length;
  const checkedInCount = reservations.filter(r => r.status === 'checked-in').length;
  const totalAmount = reservations.reduce((sum, r) => sum + (r.totalAmount || 0), 0);

  return (
    <div className="guest-page-container">
      <div className="page-header">
        <div className="page-header-content">
          <div className="page-title-section">
            <div className="page-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <div>
              <h1 className="page-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <span>My Reservations</span>
              </h1>
              <p className="page-subtitle">Manage your bookings and view reservation history</p>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            {showForm ? 'Cancel' : 'New Reservation'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="page-stats-grid">
        <div className="page-stat-card">
          <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #d4af37 0%, #b8941f 100%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div className="stat-card-content">
            <div className="stat-card-value">{confirmedCount}</div>
            <div className="stat-card-label">Confirmed</div>
          </div>
        </div>
        <div className="page-stat-card">
          <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #2196F3 0%, #1565C0 100%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <div className="stat-card-content">
            <div className="stat-card-value">{checkedInCount}</div>
            <div className="stat-card-label">Checked In</div>
          </div>
        </div>
        <div className="page-stat-card">
          <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #8b6f47 0%, #6b5a4a 100%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <div className="stat-card-content">
            <div className="stat-card-value">${totalAmount.toFixed(2)}</div>
            <div className="stat-card-label">Total Value</div>
          </div>
        </div>
        <div className="page-stat-card">
          <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4"></path>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h7"></path>
            </svg>
          </div>
          <div className="stat-card-content">
            <div className="stat-card-value">{reservations.length}</div>
            <div className="stat-card-label">Total Reservations</div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="glass-card" style={{ marginBottom: '2rem' }}>
          <h2 className="section-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span>Create New Reservation</span>
          </h2>
          <p style={{ color: '#8b6f47', marginBottom: '1.5rem' }}>Fill in the details below to create a new reservation</p>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
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
                      {room.roomNumber} - {room.roomType} (${room.pricePerNight}/night)
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Number of Guests</label>
                <input
                  type="number"
                  value={formData.numberOfGuests}
                  onChange={(e) => setFormData({ ...formData, numberOfGuests: parseInt(e.target.value) })}
                  required
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Check-in Date</label>
                <input
                  type="date"
                  value={formData.checkInDate}
                  onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Check-out Date</label>
                <input
                  type="date"
                  value={formData.checkOutDate}
                  onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Special Requests</label>
              <textarea
                value={formData.specialRequests}
                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-primary">Create Reservation</button>
          </form>
        </div>
      )}

      <div className="glass-card">
        <h2 className="section-title section-title-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <span>Reservation History</span>
        </h2>

        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="checked-in">Checked-in</option>
            <option value="checked-out">Checked-out</option>
            <option value="cancelled">Cancelled</option>
          </select>
          {reservations.length === 0 && (
            <p style={{ color: '#8b6f47', margin: 0 }}>No reservations found</p>
          )}
        </div>

        {reservations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
            </div>
            <p className="empty-state-text">No reservations found</p>
            <p style={{ color: '#8b6f47', marginTop: '0.5rem' }}>Create your first reservation to get started</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Confirmation #</th>
                <th>Room</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Guests</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(reservation => (
                <tr key={reservation._id}>
                  <td>{reservation.confirmationNumber}</td>
                  <td>{reservation.roomId?.roomNumber} - {reservation.roomId?.roomType}</td>
                  <td>{new Date(reservation.checkInDate).toLocaleDateString()}</td>
                  <td>{new Date(reservation.checkOutDate).toLocaleDateString()}</td>
                  <td>{reservation.numberOfGuests}</td>
                  <td>${reservation.totalAmount?.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${reservation.status === 'confirmed' ? 'badge-success' :
                      reservation.status === 'checked-in' ? 'badge-info' :
                        reservation.status === 'checked-out' ? 'badge-secondary' :
                          reservation.status === 'cancelled' ? 'badge-danger' :
                            'badge-warning'
                      }`}>
                      {reservation.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      {['pending', 'confirmed'].includes(reservation.status) && (
                        <button
                          className="btn btn-danger"
                          onClick={() => handleCancel(reservation._id)}
                          style={{ padding: '5px 10px', fontSize: '12px' }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <GuestFooter />
    </div>
  );
};

export default Reservations;

