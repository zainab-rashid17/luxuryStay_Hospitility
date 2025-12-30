import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext.jsx';
import GuestFooter from '../../components/GuestFooter.jsx';

const Billing = () => {
  const { user } = useContext(AuthContext);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await axios.get('/api/billing', { params: { guestId: user?._id } });
      setBills(response.data.bills);

      // Fallback for frontend-only dev/testing if no bills exist
      if (!response.data.bills || response.data.bills.length === 0) {
        console.log('No bills from backend. Using Mock Data for UI verification.');
        setBills([
          {
            _id: 'mock-bill-1',
            invoiceNumber: 'INV-MOCK-001',
            roomCharges: 450.00,
            additionalServices: [{ totalPrice: 50.00 }],
            taxes: 45.00,
            discount: 0,
            totalAmount: 545.00,
            paymentStatus: 'pending',
            createdAt: new Date().toISOString()
          },
          {
            _id: 'mock-bill-2',
            invoiceNumber: 'INV-MOCK-002',
            roomCharges: 300.00,
            additionalServices: [],
            taxes: 30.00,
            discount: 10.00,
            totalAmount: 320.00,
            paymentStatus: 'paid',
            createdAt: new Date(Date.now() - 86400000).toISOString()
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching bills:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  const paidBills = bills.filter(b => b.paymentStatus === 'paid').length;
  const pendingBills = bills.filter(b => b.paymentStatus === 'pending').length;
  const totalPaid = bills.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const totalPending = bills.filter(b => b.paymentStatus === 'pending').reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  return (
    <div className="guest-page-container">
      <div className="page-header">
        <div className="page-header-content">
          <div className="page-title-section">
            <div className="page-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <div>
              <h1 className="page-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <span>My Bills</span>
              </h1>
              <p className="page-subtitle">View invoices, payment history, and download receipts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="page-stats-grid">
        <div className="page-stat-card">
          <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div className="stat-card-content">
            <div className="stat-card-value">{paidBills}</div>
            <div className="stat-card-label">Paid Bills</div>
          </div>
        </div>
        <div className="page-stat-card">
          <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #FFA726 0%, #F57C00 100%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div className="stat-card-content">
            <div className="stat-card-value">{pendingBills}</div>
            <div className="stat-card-label">Pending Bills</div>
          </div>
        </div>
        <div className="page-stat-card">
          <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <div className="stat-card-content">
            <div className="stat-card-value">${totalPaid.toFixed(2)}</div>
            <div className="stat-card-label">Total Paid</div>
          </div>
        </div>
        <div className="page-stat-card">
          <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #EF5350 0%, #C62828 100%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <div className="stat-card-content">
            <div className="stat-card-value">${totalPending.toFixed(2)}</div>
            <div className="stat-card-label">Total Pending</div>
          </div>
        </div>
      </div>

      <div className="glass-card">
        <h2 className="section-title">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <span>Invoice History</span>
        </h2>

        {bills.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
            </div>
            <p className="empty-state-text">No bills found</p>
            <p style={{ color: '#8b6f47', marginTop: '0.5rem' }}>Your invoices will appear here after checkout</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Invoice #</th>
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
                  <td>${bill.roomCharges?.toFixed(2)}</td>
                  <td>${bill.additionalServices?.reduce((sum, s) => sum + s.totalPrice, 0).toFixed(2)}</td>
                  <td>${bill.taxes?.toFixed(2)}</td>
                  <td>${bill.discount?.toFixed(2)}</td>
                  <td><strong>${bill.totalAmount?.toFixed(2)}</strong></td>
                  <td>
                    <span className={`badge ${bill.paymentStatus === 'paid' ? 'badge-success' :
                        bill.paymentStatus === 'partial' ? 'badge-warning' :
                          'badge-danger'
                      }`}>
                      {bill.paymentStatus}
                    </span>
                  </td>
                  <td>
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
                          if (error.response?.status === 403) {
                            alert('You are not authorized to download this invoice.');
                          } else if (error.response?.status === 404) {
                            alert('Invoice not found.');
                          } else {
                            alert('Failed to download PDF. Please try again.');
                          }
                        }
                      }}
                      style={{ padding: '5px 10px', fontSize: '12px' }}
                    >
                      Download PDF
                    </button>
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

export default Billing;

