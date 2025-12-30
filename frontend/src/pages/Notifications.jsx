import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import './Notifications.css';

const Notifications = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read

  useEffect(() => {
    fetchNotifications();
    // Refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      const params = filter === 'unread' ? { unreadOnly: 'true' } : {};
      const response = await axios.get('/api/notifications', { params });
      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.unreadCount || 0);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put('/api/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking':
        return '📅';
      case 'payment':
        return '💳';
      case 'checkin':
        return '✅';
      case 'checkout':
        return '🚪';
      case 'maintenance':
        return '🔧';
      case 'system':
        return '⚙️';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'booking':
        return '#007bff';
      case 'payment':
        return '#28a745';
      case 'checkin':
        return '#17a2b8';
      case 'checkout':
        return '#ffc107';
      case 'maintenance':
        return '#dc3545';
      case 'system':
        return '#6c757d';
      default:
        return '#333';
    }
  };

  const filteredNotifications = filter === 'all'
    ? notifications
    : filter === 'unread'
    ? notifications.filter(n => !n.isRead)
    : notifications.filter(n => n.isRead);

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h1>Notifications</h1>
        <div className="notifications-actions">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Notifications</option>
            <option value="unread">Unread ({unreadCount})</option>
            <option value="read">Read</option>
          </select>
          {unreadCount > 0 && (
            <button
              className="btn btn-primary"
              onClick={markAllAsRead}
            >
              Mark All as Read
            </button>
          )}
        </div>
      </div>

      <div className="notifications-stats">
        <div className="stat-card">
          <h3>Total</h3>
          <p>{notifications.length}</p>
        </div>
        <div className="stat-card unread">
          <h3>Unread</h3>
          <p>{unreadCount}</p>
        </div>
        <div className="stat-card read">
          <h3>Read</h3>
          <p>{notifications.length - unreadCount}</p>
        </div>
      </div>

      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="notifications-empty">
            <p>No notifications found</p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div
              key={notification._id}
              className={`notification-card ${!notification.isRead ? 'unread' : ''}`}
            >
              <div
                className="notification-icon"
                style={{ backgroundColor: getNotificationColor(notification.type) + '20', color: getNotificationColor(notification.type) }}
              >
                {getNotificationIcon(notification.type)}
              </div>
              <div className="notification-details">
                <div className="notification-title-row">
                  <h3>{notification.title}</h3>
                  {!notification.isRead && (
                    <span className="unread-badge">New</span>
                  )}
                </div>
                <p className="notification-message">{notification.message}</p>
                <div className="notification-meta">
                  <span className="notification-type">{notification.type}</span>
                  <span className="notification-time">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
              {!notification.isRead && (
                <button
                  className="mark-read-btn"
                  onClick={() => markAsRead(notification._id)}
                  title="Mark as read"
                >
                  ✓
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;

