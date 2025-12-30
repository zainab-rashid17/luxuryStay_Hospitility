import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import GuestFooter from '../../components/GuestFooter.jsx';

const Rooms = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', roomType: '' });

  useEffect(() => {
    fetchRooms();
  }, [filter]);

  const fetchRooms = async () => {
    try {
      const params = { status: 'available' };
      if (filter.roomType) params.roomType = filter.roomType;
      
      const response = await axios.get('/api/rooms', { params });
      setRooms(response.data.rooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  const roomTypes = [...new Set(rooms.map(r => r.roomType))];
  const avgPrice = rooms.length > 0 
    ? (rooms.reduce((sum, r) => sum + r.pricePerNight, 0) / rooms.length).toFixed(2)
    : 0;

  return (
    <div className="guest-page-container">
      <div className="page-header">
        <div className="page-header-content">
          <div className="page-title-section">
            <div className="page-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <div>
              <h1 className="page-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <span>Available Rooms</span>
              </h1>
              <p className="page-subtitle">Browse our luxurious rooms and suites</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="page-stats-grid">
        <div className="page-stat-card">
          <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #d4af37 0%, #b8941f 100%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <div className="stat-card-content">
            <div className="stat-card-value">{rooms.length}</div>
            <div className="stat-card-label">Available Rooms</div>
          </div>
        </div>
        <div className="page-stat-card">
          <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #8b6f47 0%, #6b5a4a 100%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>
          </div>
          <div className="stat-card-content">
            <div className="stat-card-value">{roomTypes.length}</div>
            <div className="stat-card-label">Room Types</div>
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
            <div className="stat-card-value">${avgPrice}</div>
            <div className="stat-card-label">Avg. Price/Night</div>
          </div>
        </div>
      </div>

      <div className="glass-card">
        <h2 className="section-title section-title-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <span>Room Catalog</span>
        </h2>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <select
            value={filter.roomType}
            onChange={(e) => setFilter({ ...filter, roomType: e.target.value })}
            className="filter-select"
          >
            <option value="">All Types</option>
            <option value="Single">Single</option>
            <option value="Double">Double</option>
            <option value="Suite">Suite</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Presidential">Presidential</option>
          </select>
        </div>

        {rooms.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <p className="empty-state-text">No rooms available</p>
            <p style={{ color: '#8b6f47', marginTop: '0.5rem' }}>Please check back later</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '24px' 
          }}>
            {rooms.map(room => (
              <div 
                key={room._id}
                style={{
                  background: '#fff',
                  borderRadius: '12px',
                  border: '1px solid #e0e0e0',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                }}
              >
                {/* Room Image */}
                <div style={{ 
                  width: '100%', 
                  height: '220px', 
                  overflow: 'hidden',
                  background: '#f5f5f5',
                  position: 'relative'
                }}>
                  {room.images && room.images.length > 0 ? (
                    <img 
                      src={room.images[0]} 
                      alt={`Room ${room.roomNumber}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                      color: '#999',
                      fontSize: '14px'
                    }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '64px', marginBottom: '10px' }}>🛏️</div>
                        <div style={{ fontWeight: '600' }}>No Image</div>
                      </div>
                    </div>
                  )}
                  {/* Room Type Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(199, 146, 91, 0.95)',
                    color: '#fff',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {room.roomType}
                  </div>
                </div>

                {/* Room Details */}
                <div style={{ padding: '24px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    marginBottom: '16px'
                  }}>
                    <div>
                      <h3 style={{ 
                        margin: 0, 
                        fontSize: '24px', 
                        fontWeight: 'bold',
                        color: '#333',
                        marginBottom: '6px'
                      }}>
                        Room {room.roomNumber}
                      </h3>
                      <p style={{ 
                        margin: 0, 
                        color: '#666', 
                        fontSize: '14px'
                      }}>
                        Floor {room.floor}
                      </p>
                    </div>
                    <div style={{
                      textAlign: 'right'
                    }}>
                      <div style={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                        color: '#c7925b',
                        lineHeight: '1'
                      }}>
                        ${room.pricePerNight.toFixed(2)}
                      </div>
                      <div style={{ 
                        fontSize: '12px', 
                        fontWeight: 'normal',
                        color: '#999',
                        marginTop: '4px'
                      }}>
                        per night
                      </div>
                    </div>
                  </div>

                  {/* Room Info Grid */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '12px',
                    marginBottom: '16px',
                    padding: '16px',
                    background: '#f9f9f9',
                    borderRadius: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '20px' }}>👥</span>
                      <div>
                        <div style={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', fontWeight: '600' }}>
                          Max Guests
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: '700', color: '#333' }}>
                          {room.maxOccupancy}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '20px' }}>🏢</span>
                      <div>
                        <div style={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', fontWeight: '600' }}>
                          Floor
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: '700', color: '#333' }}>
                          {room.floor}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {room.description && (
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#666', 
                      marginBottom: '16px',
                      lineHeight: '1.6',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {room.description}
                    </p>
                  )}

                  {/* View Details Button */}
                  <button
                    onClick={() => {
                      navigate(`/rooms/${room._id}`);
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #c7925b 0%, #8b6f47 100%)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #8b6f47 0%, #6b5a4a 100%)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(199, 146, 91, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #c7925b 0%, #8b6f47 100%)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <GuestFooter />
    </div>
  );
};

export default Rooms;

