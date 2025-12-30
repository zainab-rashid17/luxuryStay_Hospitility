import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext.jsx';
import AdminLayout from '../../components/AdminLayout.jsx';

const Reservations = () => {
  const { user } = useContext(AuthContext);
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
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
      const params = {};
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
      await axios.post('/api/reservations', formData);
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
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating reservation');
    }
  };

  const handleCheckIn = async (id) => {
    try {
      await axios.put(`/api/reservations/${id}/checkin`);
      fetchReservations();
    } catch (error) {
      alert(error.response?.data?.message || 'Error checking in');
    }
  };

  const handleCheckOut = async (id) => {
    try {
      await axios.put(`/api/reservations/${id}/checkout`);
      fetchReservations();
    } catch (error) {
      alert(error.response?.data?.message || 'Error checking out');
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

  const handleStatusChange = async (id, newStatus) => {
    try {
      if (newStatus === 'checked-in') {
        await axios.put(`/api/reservations/${id}/checkin`);
      } else if (newStatus === 'checked-out') {
        await axios.put(`/api/reservations/${id}/checkout`);
      } else {
        await axios.put(`/api/reservations/${id}`, { status: newStatus });
      }
      fetchReservations();
    } catch (error) {
      console.error('Status update failed:', error);
      alert(error.response?.data?.message || 'Error updating status');
    }
  };

  const handleDownloadBill = async (reservationId) => {
    try {
      // Find bill associated with reservation
      const response = await axios.get('/api/billing', { params: { reservationId } });
      if (response.data.bills && response.data.bills.length > 0) {
        const bill = response.data.bills[0];

        // Download the PDF
        const pdfResponse = await axios.get(`/api/billing/${bill._id}/pdf`, {
          responseType: 'blob'
        });

        const blob = new Blob([pdfResponse.data], { type: 'application/pdf' });
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

      } else {
        alert('No bill generated for this reservation yet.');
      }
    } catch (error) {
      console.error('Error downloading bill:', error);
      alert('Failed to find or download bill.');
    }
  };

  return (
    <AdminLayout title="Reservations" subtitle="Track bookings, check-ins and departures">
      <div className="page-header" style={{ marginBottom: '20px' }}>
        <h2>Reservations</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'New Reservation'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2>Create New Reservation</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
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

      <div className="card">
        <div style={{ marginBottom: '20px' }}>
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            style={{ padding: '8px' }}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="checked-in">Checked-in</option>
            <option value="checked-out">Checked-out</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Confirmation #</th>
              <th>Guest</th>
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
                <td>
                  {reservation.guestId?.firstName} {reservation.guestId?.lastName}
                </td>
                <td>{reservation.roomId?.roomNumber} - {reservation.roomId?.roomType}</td>
                <td>{new Date(reservation.checkInDate).toLocaleDateString()}</td>
                <td>{new Date(reservation.checkOutDate).toLocaleDateString()}</td>
                <td>{reservation.numberOfGuests}</td>
                <td>${reservation.totalAmount?.toFixed(2)}</td>
                <td style={{ padding: '0.5rem' }}>{/* Compact padding */}
                  <div className="status-select-container">
                    <select
                      value={reservation.status}
                      onChange={(e) => handleStatusChange(reservation._id, e.target.value)}
                      className={`status-badge status-${reservation.status}`}
                      style={{
                        padding: '5px',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                        fontSize: '12px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        // Dynamic color based on status
                        backgroundColor:
                          reservation.status === 'confirmed' ? '#d4edda' :
                            reservation.status === 'checked-in' ? '#d1ecf1' :
                              reservation.status === 'checked-out' ? '#e2e3e5' :
                                reservation.status === 'cancelled' ? '#f8d7da' : '#fff3cd',
                        color:
                          reservation.status === 'confirmed' ? '#155724' :
                            reservation.status === 'checked-in' ? '#0c5460' :
                              reservation.status === 'checked-out' ? '#383d41' :
                                reservation.status === 'cancelled' ? '#721c24' : '#856404'
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="checked-in">Checked In</option>
                      <option value="checked-out">Checked Out</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    {reservation.status === 'confirmed' && (
                      <button
                        className="btn btn-success"
                        onClick={() => handleCheckIn(reservation._id)}
                        style={{ padding: '5px 10px', fontSize: '12px' }}
                      >
                        Check-in
                      </button>
                    )}
                    {reservation.status === 'checked-in' && (
                      <button
                        className="btn btn-primary"
                        onClick={() => handleCheckOut(reservation._id)}
                        style={{ padding: '5px 10px', fontSize: '12px' }}
                      >
                        Check-out
                      </button>
                    )}
                    {['pending', 'confirmed'].includes(reservation.status) && (
                      <button
                        className="btn btn-danger"
                        onClick={() => handleCancel(reservation._id)}
                        style={{ padding: '5px 10px', fontSize: '12px' }}
                      >
                        Cancel
                      </button>
                    )}
                    {['confirmed', 'checked-in', 'checked-out'].includes(reservation.status) && (
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleDownloadBill(reservation._id)}
                        style={{ padding: '5px 10px', fontSize: '12px', backgroundColor: '#6c757d', color: 'white' }}
                        title="Download Bill"
                      >
                        Bill
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style jsx>{`
        .table th, .table td {
          padding: 0.75rem 0.5rem; /* More compact */
          vertical-align: middle;
        }
        .table {
           font-size: 0.9rem; /* Slightly smaller font */
        }
      `}</style>
    </AdminLayout >
  );
};

export default Reservations;
