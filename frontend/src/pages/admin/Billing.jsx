import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext.jsx';
import AdminLayout from '../../components/AdminLayout.jsx';

const Billing = () => {
  const { user } = useContext(AuthContext);
  const [bills, setBills] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    reservationId: '',
    roomCharges: 0,
    additionalServices: [],
    taxes: 0,
    discount: 0
  });

  useEffect(() => {
    fetchBills();
    fetchReservations();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await axios.get('/api/billing');
      setBills(response.data.bills);
    } catch (error) {
      console.error('Error fetching bills:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await axios.get('/api/reservations', { params: { status: 'checked-in' } });
      setReservations(response.data.reservations);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/billing', formData);
      setShowForm(false);
      setFormData({
        reservationId: '',
        roomCharges: 0,
        additionalServices: [],
        taxes: 0,
        discount: 0
      });
      fetchBills();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating bill');
    }
  };

  const handlePaymentUpdate = async (id, paymentStatus, paymentMethod) => {
    try {
      await axios.put(`/api/billing/${id}/payment`, { paymentStatus, paymentMethod });
      fetchBills();
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating payment');
    }
  };

  return (
    <AdminLayout title="Billing" subtitle="Coffee-brown overview of invoices and payments">
      <div className="page-header" style={{ marginBottom: '20px' }}>
        <h2>Billing & Invoicing</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Create Bill'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2>Create New Bill</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Reservation</label>
                <select
                  value={formData.reservationId}
                  onChange={(e) => setFormData({ ...formData, reservationId: e.target.value })}
                  required
                >
                  <option value="">Select Reservation</option>
                  {reservations.map(res => (
                    <option key={res._id} value={res._id}>
                      {res.confirmationNumber} - {res.guestId?.firstName} {res.guestId?.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Room Charges ($)</label>
                <input
                  type="number"
                  value={formData.roomCharges}
                  onChange={(e) => setFormData({ ...formData, roomCharges: parseFloat(e.target.value) })}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label>Taxes ($)</label>
                <input
                  type="number"
                  value={formData.taxes}
                  onChange={(e) => setFormData({ ...formData, taxes: parseFloat(e.target.value) })}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label>Discount ($)</label>
                <input
                  type="number"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) })}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Create Bill</button>
          </form>
        </div>
      )}

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Guest</th>
              <th>Room Charges</th>
              <th>Services</th>
              <th>Taxes</th>
              <th>Discount</th>
              <th>Total</th>
              <th>Payment Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bills.map(bill => (
              <tr key={bill._id}>
                <td>{bill.invoiceNumber}</td>
                <td>
                  {bill.guestId?.firstName} {bill.guestId?.lastName}
                </td>
                <td>${bill.roomCharges?.toFixed(2)}</td>
                <td>${bill.additionalServices?.reduce((sum, s) => sum + s.totalPrice, 0).toFixed(2)}</td>
                <td>${bill.taxes?.toFixed(2)}</td>
                <td>${bill.discount?.toFixed(2)}</td>
                <td><strong>${bill.totalAmount?.toFixed(2)}</strong></td>
                <td>
                  <span className={`badge ${
                    bill.paymentStatus === 'paid' ? 'badge-success' :
                    bill.paymentStatus === 'partial' ? 'badge-warning' :
                    'badge-danger'
                  }`}>
                    {bill.paymentStatus}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button
                      className="btn btn-primary"
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem('token');
                          const response = await axios.get(`/api/billing/${bill._id}/pdf`, {
                            responseType: 'blob',
                            headers: {
                              'Authorization': `Bearer ${token}`
                            }
                          });
                          
                          // Create blob URL
                          const blob = new Blob([response.data], { type: 'application/pdf' });
                          const url = window.URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.setAttribute('download', `invoice_${bill.invoiceNumber || bill._id}.pdf`);
                          document.body.appendChild(link);
                          link.click();
                          
                          // Cleanup
                          setTimeout(() => {
                            link.remove();
                            window.URL.revokeObjectURL(url);
                          }, 100);
                        } catch (error) {
                          console.error('Error downloading PDF:', error);
                          alert('Failed to download PDF. Please try again.');
                        }
                      }}
                      style={{ padding: '5px 10px', fontSize: '12px' }}
                    >
                      Download PDF
                    </button>
                    {bill.paymentStatus !== 'paid' && (
                      <select
                        onChange={(e) => {
                          const [status, method] = e.target.value.split('|');
                          handlePaymentUpdate(bill._id, status, method);
                        }}
                        style={{ padding: '5px', fontSize: '12px' }}
                      >
                        <option value="">Update Payment</option>
                        <option value="paid|cash">Mark as Paid (Cash)</option>
                        <option value="paid|card">Mark as Paid (Card)</option>
                        <option value="paid|upi">Mark as Paid (UPI)</option>
                        <option value="partial|cash">Partial Payment</option>
                      </select>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default Billing;

