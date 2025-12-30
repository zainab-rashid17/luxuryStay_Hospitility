import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext.jsx';
import GuestFooter from '../../components/GuestFooter.jsx';

const Feedback = () => {
  const { user } = useContext(AuthContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    reservationId: '',
    rating: 5,
    category: 'overall',
    comment: '',
    isAnonymous: false
  });

  useEffect(() => {
    fetchFeedbacks();
    fetchReservations();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get('/api/feedback', { params: { guestId: user?._id } });
      setFeedbacks(response.data.feedbacks);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await axios.get('/api/reservations', { params: { status: 'checked-out', guestId: user?._id } });
      setReservations(response.data.reservations);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/feedback', formData);
      setShowForm(false);
      setFormData({
        reservationId: '',
        rating: 5,
        category: 'overall',
        comment: '',
        isAnonymous: false
      });
      fetchFeedbacks();
    } catch (error) {
      alert(error.response?.data?.message || 'Error submitting feedback');
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  const approvedCount = feedbacks.filter(f => f.status === 'approved').length;
  const avgRating = feedbacks.length > 0 
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : 0;

  return (
    <div className="guest-page-container">
      <div className="page-header">
        <div className="page-header-content">
          <div className="page-title-section">
            <div className="page-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"></path>
                <line x1="9" y1="10" x2="15" y2="10"></line>
                <line x1="9" y1="14" x2="13" y2="14"></line>
              </svg>
            </div>
            <div>
              <h1 className="page-title">
                <span>Feedback</span>
              </h1>
              <p className="page-subtitle">Share your experience and help us improve our services</p>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            {showForm ? 'Cancel' : 'LEAVE FEEDBACK'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="page-stats-grid">
        <div className="page-stat-card">
          <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #d4af37 0%, #b8941f 100%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>
          </div>
          <div className="stat-card-content">
            <div className="stat-card-value">{avgRating}</div>
            <div className="stat-card-label">Average Rating</div>
          </div>
        </div>
        <div className="page-stat-card">
          <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div className="stat-card-content">
            <div className="stat-card-value">{approvedCount}</div>
            <div className="stat-card-label">Approved</div>
          </div>
        </div>
        <div className="page-stat-card">
          <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #8b6f47 0%, #6b5a4a 100%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"></path>
            </svg>
          </div>
          <div className="stat-card-content">
            <div className="stat-card-value">{feedbacks.length}</div>
            <div className="stat-card-label">Total Feedback</div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="glass-card" style={{ marginBottom: '2rem' }}>
          <h2 className="section-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span>Leave Feedback</span>
          </h2>
          <p style={{ color: '#8b6f47', marginBottom: '1.5rem' }}>Your feedback helps us provide better service</p>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Reservation</label>
                <select
                  value={formData.reservationId}
                  onChange={(e) => setFormData({ ...formData, reservationId: e.target.value })}
                >
                  <option value="">Select Reservation (Optional)</option>
                  {reservations.map(res => (
                    <option key={res._id} value={res._id}>
                      {res.confirmationNumber} - {new Date(res.checkInDate).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="overall">Overall</option>
                  <option value="room">Room</option>
                  <option value="service">Service</option>
                  <option value="food">Food</option>
                  <option value="cleanliness">Cleanliness</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
              <div className="form-group">
                <label>Rating (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isAnonymous}
                    onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                  />
                  Submit anonymously
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>Comment</label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                placeholder="Share your experience..."
              />
            </div>
            <button type="submit" className="btn btn-primary">Submit Feedback</button>
          </form>
        </div>
      )}

      <div className="glass-card">
        <h2 className="section-title section-title-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <span>Feedback History</span>
        </h2>
        
        {feedbacks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"></path>
              </svg>
            </div>
            <p className="empty-state-text">No feedback submitted</p>
            <p style={{ color: '#8b6f47', marginTop: '0.5rem' }}>Share your experience with us</p>
          </div>
        ) : (
          <table className="table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map(feedback => (
              <tr key={feedback._id}>
                <td>{feedback.category}</td>
                <td>
                  <span className="badge badge-info">
                    {'★'.repeat(feedback.rating)}{'☆'.repeat(5 - feedback.rating)}
                  </span>
                </td>
                <td>{feedback.comment || '-'}</td>
                <td>
                  <span className={`badge ${
                    feedback.status === 'approved' ? 'badge-success' :
                    feedback.status === 'rejected' ? 'badge-danger' :
                    'badge-warning'
                  }`}>
                    {feedback.status}
                  </span>
                </td>
                <td>{new Date(feedback.createdAt).toLocaleDateString()}</td>
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

export default Feedback;
