import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import GuestFooter from '../../components/GuestFooter.jsx';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(1);

  useEffect(() => {
    fetchRoomDetails();
  }, [id]);

  const fetchRoomDetails = async () => {
    try {
      const response = await axios.get(`/api/rooms/${id}`);
      setRoom(response.data.room);
    } catch (error) {
      console.error('Error fetching room details:', error);
      alert('Room not found');
      navigate('/rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!checkInDate || !checkOutDate) {
      alert('Please select check-in and check-out dates');
      return;
    }
    
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    
    if (checkOut <= checkIn) {
      alert('Check-out date must be after check-in date');
      return;
    }

    // Navigate to reservations page with room data
    navigate('/reservations', {
      state: {
        roomId: room._id,
        checkInDate,
        checkOutDate,
        numberOfGuests
      }
    });
  };

  if (loading) {
    return (
      <div className="guest-page-container">
        <div className="loading"><div className="spinner"></div></div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="guest-page-container">
        <div className="empty-state">
          <p>Room not found</p>
          <Link to="/rooms" className="btn btn-primary">Back to Rooms</Link>
        </div>
      </div>
    );
  }

  const nights = checkInDate && checkOutDate 
    ? Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24))
    : 1;
  const totalPrice = room.pricePerNight * nights;

  return (
    <div className="guest-page-container">
      {/* Breadcrumb */}
      <div style={{ 
        padding: '24px 0', 
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(254, 252, 249, 0.95) 100%)',
        borderBottom: '2px solid rgba(212, 175, 55, 0.2)',
        marginBottom: '30px',
        boxShadow: '0 2px 10px rgba(139, 115, 85, 0.05)'
      }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            fontSize: '15px',
            fontWeight: '500'
          }}>
            <Link to="/" style={{ 
              color: '#c7925b', 
              textDecoration: 'none',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#8b6f47'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#c7925b'}
            >Home</Link>
            <span style={{ color: '#999' }}>/</span>
            <Link to="/rooms" style={{ 
              color: '#c7925b', 
              textDecoration: 'none',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#8b6f47'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#c7925b'}
            >Rooms</Link>
            <span style={{ color: '#999' }}>/</span>
            <span style={{ 
              color: '#333', 
              fontWeight: '600',
              background: 'linear-gradient(135deg, #8b6f47 0%, #c7925b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Room {room.roomNumber}</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        {/* Room Header */}
        <div style={{ 
          marginBottom: '40px',
          padding: '30px',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(254, 252, 249, 0.95) 100%)',
          borderRadius: '20px',
          border: '2px solid rgba(212, 175, 55, 0.2)',
          boxShadow: '0 8px 24px rgba(139, 115, 85, 0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)',
            borderRadius: '50%'
          }}></div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            position: 'relative',
            zIndex: 1
          }}>
            <div>
              <div style={{
                display: 'inline-block',
                padding: '8px 20px',
                background: 'linear-gradient(135deg, #c7925b 0%, #8b6f47 100%)',
                color: '#fff',
                borderRadius: '25px',
                fontSize: '14px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '16px',
                boxShadow: '0 4px 12px rgba(199, 146, 91, 0.3)'
              }}>
                {room.roomType}
              </div>
              <h1 style={{ 
                fontSize: '42px', 
                fontWeight: '800', 
                background: 'linear-gradient(135deg, #8b6f47 0%, #b8941f 50%, #d4af37 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                margin: 0,
                marginBottom: '12px',
                letterSpacing: '-1px'
              }}>
                Room {room.roomNumber}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666' }}>
                  <span style={{ fontSize: '20px' }}>🏢</span>
                  <span style={{ fontSize: '16px', fontWeight: '500' }}>Floor {room.floor}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666' }}>
                  <span style={{ fontSize: '20px' }}>👥</span>
                  <span style={{ fontSize: '16px', fontWeight: '500' }}>Up to {room.maxOccupancy} Guests</span>
                </div>
                <div style={{ 
                  padding: '6px 14px',
                  background: room.status === 'available' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: room.status === 'available' ? '#4CAF50' : '#f44336',
                  textTransform: 'capitalize'
                }}>
                  {room.status}
                </div>
              </div>
            </div>
            <div style={{ 
              textAlign: 'right',
              padding: '20px 30px',
              background: 'linear-gradient(135deg, rgba(199, 146, 91, 0.1) 0%, rgba(139, 111, 71, 0.05) 100%)',
              borderRadius: '16px',
              border: '2px solid rgba(199, 146, 91, 0.2)'
            }}>
              <div style={{ 
                fontSize: '42px', 
                fontWeight: '800', 
                background: 'linear-gradient(135deg, #c7925b 0%, #8b6f47 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '6px',
                lineHeight: '1'
              }}>
                ${room.pricePerNight.toFixed(2)}
              </div>
              <div style={{ 
                fontSize: '14px', 
                color: '#999',
                fontWeight: '500'
              }}>per night</div>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        {room.images && room.images.length > 0 ? (
          <div style={{ marginBottom: '50px' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: room.images.length > 1 ? '2fr 1fr 1fr' : '1fr',
              gap: '12px',
              height: '550px',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 12px 40px rgba(139, 115, 85, 0.15)',
              border: '2px solid rgba(212, 175, 55, 0.1)'
            }}>
              {/* Main Image */}
              <div style={{ 
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                background: '#f5f5f5'
              }}
              onMouseEnter={(e) => {
                const img = e.currentTarget.querySelector('img');
                if (img) img.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                const img = e.currentTarget.querySelector('img');
                if (img) img.style.transform = 'scale(1)';
              }}
              >
                <img 
                  src={room.images[selectedImageIndex]} 
                  alt={`Room ${room.roomNumber} - Image ${selectedImageIndex + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                />
                {room.images.length > 1 && (
                  <div style={{
                    position: 'absolute',
                    bottom: '24px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '10px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    padding: '8px 16px',
                    borderRadius: '25px',
                    backdropFilter: 'blur(10px)'
                  }}>
                    {room.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        style={{
                          width: index === selectedImageIndex ? '24px' : '10px',
                          height: '10px',
                          borderRadius: '5px',
                          border: 'none',
                          background: index === selectedImageIndex ? '#fff' : 'rgba(255,255,255,0.6)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: index === selectedImageIndex ? '0 2px 8px rgba(255,255,255,0.5)' : 'none'
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {room.images.length > 1 && room.images.slice(0, 2).map((image, index) => (
                index + 1 < room.images.length && (
                  <div 
                    key={index + 1}
                    style={{ 
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      opacity: selectedImageIndex === index + 1 ? 1 : 0.85,
                      border: selectedImageIndex === index + 1 ? '3px solid #c7925b' : '3px solid transparent',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      background: '#f5f5f5'
                    }}
                    onClick={() => setSelectedImageIndex(index + 1)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.borderColor = '#c7925b';
                    }}
                    onMouseLeave={(e) => {
                      if (selectedImageIndex !== index + 1) {
                        e.currentTarget.style.opacity = '0.85';
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.borderColor = 'transparent';
                      }
                    }}
                  >
                    <img 
                      src={image} 
                      alt={`Room ${room.roomNumber} - Thumbnail ${index + 2}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                    />
                    {selectedImageIndex === index + 1 && (
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        width: '24px',
                        height: '24px',
                        background: '#c7925b',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 8px rgba(199, 146, 91, 0.4)'
                      }}>✓</div>
                    )}
                  </div>
                )
              ))}
            </div>

            {/* Image Thumbnails Row (if more than 3 images) */}
            {room.images.length > 3 && (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: `repeat(${Math.min(room.images.length - 3, 4)}, 1fr)`,
                gap: '10px',
                marginTop: '10px'
              }}>
                {room.images.slice(3).map((image, index) => (
                  <div 
                    key={index + 3}
                    style={{ 
                      height: '120px',
                      overflow: 'hidden',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      opacity: selectedImageIndex === index + 3 ? 1 : 0.7
                    }}
                    onClick={() => setSelectedImageIndex(index + 3)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      if (selectedImageIndex !== index + 3) {
                        e.currentTarget.style.opacity = '0.7';
                      }
                    }}
                  >
                    <img 
                      src={image} 
                      alt={`Room ${room.roomNumber} - Thumbnail ${index + 4}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={{ 
            height: '500px', 
            background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '40px'
          }}>
            <div style={{ textAlign: 'center', color: '#999' }}>
              <div style={{ fontSize: '64px', marginBottom: '10px' }}>🛏️</div>
              <div style={{ fontWeight: '600' }}>No Image Available</div>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px', marginBottom: '40px' }}>
          {/* Left Column - Room Details */}
          <div>
            {/* Description */}
            <div style={{ 
              marginBottom: '40px',
              padding: '30px',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(254, 252, 249, 0.95) 100%)',
              borderRadius: '20px',
              border: '2px solid rgba(212, 175, 55, 0.2)',
              boxShadow: '0 8px 24px rgba(139, 115, 85, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #c7925b 0%, #8b6f47 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(199, 146, 91, 0.3)'
                }}>
                  <span style={{ fontSize: '24px' }}>✨</span>
                </div>
                <h2 style={{ 
                  fontSize: '28px', 
                  fontWeight: '700', 
                  margin: 0,
                  background: 'linear-gradient(135deg, #8b6f47 0%, #c7925b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  About this room
                </h2>
              </div>
              <p style={{ 
                fontSize: '17px', 
                lineHeight: '1.9', 
                color: '#555',
                margin: 0
              }}>
                {room.description || 'Experience luxury and comfort in this beautifully designed room.'}
              </p>
            </div>

            {/* Amenities */}
            {room.amenities && room.amenities.length > 0 && (
              <div style={{ 
                marginBottom: '40px',
                padding: '30px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(254, 252, 249, 0.95) 100%)',
                borderRadius: '20px',
                border: '2px solid rgba(212, 175, 55, 0.2)',
                boxShadow: '0 8px 24px rgba(139, 115, 85, 0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #c7925b 0%, #8b6f47 100%)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(199, 146, 91, 0.3)'
                  }}>
                    <span style={{ fontSize: '24px' }}>🏆</span>
                  </div>
                  <h2 style={{ 
                    fontSize: '28px', 
                    fontWeight: '700', 
                    margin: 0,
                    background: 'linear-gradient(135deg, #8b6f47 0%, #c7925b 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    What this place offers
                  </h2>
                </div>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(2, 1fr)', 
                  gap: '16px' 
                }}>
                  {room.amenities.map((amenity, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '14px',
                      padding: '16px',
                      background: 'linear-gradient(135deg, rgba(199, 146, 91, 0.05) 0%, rgba(139, 111, 71, 0.02) 100%)',
                      borderRadius: '12px',
                      border: '1px solid rgba(199, 146, 91, 0.15)',
                      transition: 'all 0.3s ease',
                      cursor: 'default'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(199, 146, 91, 0.1) 0%, rgba(139, 111, 71, 0.05) 100%)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(199, 146, 91, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(199, 146, 91, 0.05) 0%, rgba(139, 111, 71, 0.02) 100%)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    >
                      <div style={{
                        width: '36px',
                        height: '36px',
                        background: 'linear-gradient(135deg, #c7925b 0%, #8b6f47 100%)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        flexShrink: 0,
                        boxShadow: '0 2px 8px rgba(199, 146, 91, 0.3)'
                      }}>✓</div>
                      <span style={{ 
                        fontSize: '16px', 
                        color: '#333',
                        fontWeight: '500'
                      }}>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Room Info */}
            <div style={{ 
              padding: '30px', 
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(254, 252, 249, 0.95) 100%)',
              borderRadius: '20px',
              border: '2px solid rgba(212, 175, 55, 0.2)',
              boxShadow: '0 8px 24px rgba(139, 115, 85, 0.08)',
              marginBottom: '40px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #c7925b 0%, #8b6f47 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(199, 146, 91, 0.3)'
                }}>
                  <span style={{ fontSize: '24px' }}>ℹ️</span>
                </div>
                <h3 style={{ 
                  fontSize: '28px', 
                  fontWeight: '700', 
                  margin: 0,
                  background: 'linear-gradient(135deg, #8b6f47 0%, #c7925b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Room Information
                </h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                {[
                  { label: 'Room Number', value: room.roomNumber, icon: '🔢' },
                  { label: 'Floor', value: `Floor ${room.floor}`, icon: '🏢' },
                  { label: 'Room Type', value: room.roomType, icon: '🏨' },
                  { label: 'Max Occupancy', value: `${room.maxOccupancy} Guests`, icon: '👥' }
                ].map((item, index) => (
                  <div key={index} style={{
                    padding: '20px',
                    background: 'linear-gradient(135deg, rgba(199, 146, 91, 0.05) 0%, rgba(139, 111, 71, 0.02) 100%)',
                    borderRadius: '12px',
                    border: '1px solid rgba(199, 146, 91, 0.15)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(199, 146, 91, 0.1) 0%, rgba(139, 111, 71, 0.05) 100%)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(199, 146, 91, 0.05) 0%, rgba(139, 111, 71, 0.02) 100%)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  >
                    <div style={{ 
                      fontSize: '13px', 
                      color: '#999', 
                      marginBottom: '8px',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>{item.label}</div>
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{ fontSize: '20px' }}>{item.icon}</span>
                      <div style={{ 
                        fontSize: '20px', 
                        fontWeight: '700', 
                        color: '#333'
                      }}>{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div>
            <div style={{
              position: 'sticky',
              top: '20px',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(254, 252, 249, 0.95) 100%)',
              border: '2px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 12px 40px rgba(139, 115, 85, 0.15)',
              backdropFilter: 'blur(10px)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-20%',
                width: '200px',
                height: '200px',
                background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
                borderRadius: '50%'
              }}></div>
              <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ 
                marginBottom: '28px',
                padding: '20px',
                background: 'linear-gradient(135deg, rgba(199, 146, 91, 0.1) 0%, rgba(139, 111, 71, 0.05) 100%)',
                borderRadius: '16px',
                border: '2px solid rgba(199, 146, 91, 0.2)',
                textAlign: 'center'
              }}>
                <div style={{ 
                  fontSize: '48px', 
                  fontWeight: '800', 
                  background: 'linear-gradient(135deg, #c7925b 0%, #8b6f47 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '8px',
                  lineHeight: '1'
                }}>
                  ${room.pricePerNight.toFixed(2)}
                </div>
                <div style={{ 
                  fontSize: '15px', 
                  color: '#666',
                  fontWeight: '500'
                }}>per night</div>
              </div>

              {/* Booking Form */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    marginBottom: '8px',
                    color: '#333'
                  }}>
                    Check-in
                  </label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '2px solid rgba(199, 146, 91, 0.2)',
                      borderRadius: '12px',
                      fontSize: '16px',
                      background: '#fff',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#c7925b';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(199, 146, 91, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(199, 146, 91, 0.2)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    marginBottom: '8px',
                    color: '#333'
                  }}>
                    Check-out
                  </label>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    min={checkInDate || new Date().toISOString().split('T')[0]}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '2px solid rgba(199, 146, 91, 0.2)',
                      borderRadius: '12px',
                      fontSize: '16px',
                      background: '#fff',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#c7925b';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(199, 146, 91, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(199, 146, 91, 0.2)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    marginBottom: '8px',
                    color: '#333'
                  }}>
                    Guests
                  </label>
                  <select
                    value={numberOfGuests}
                    onChange={(e) => setNumberOfGuests(parseInt(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '2px solid rgba(199, 146, 91, 0.2)',
                      borderRadius: '12px',
                      fontSize: '16px',
                      background: '#fff',
                      transition: 'all 0.3s ease',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#c7925b';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(199, 146, 91, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(199, 146, 91, 0.2)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {Array.from({ length: room.maxOccupancy }, (_, i) => i + 1).map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price Breakdown */}
              {checkInDate && checkOutDate && (
                <div style={{ 
                  padding: '20px', 
                  background: 'linear-gradient(135deg, rgba(199, 146, 91, 0.08) 0%, rgba(139, 111, 71, 0.04) 100%)',
                  borderRadius: '16px',
                  border: '2px solid rgba(199, 146, 91, 0.2)',
                  marginBottom: '24px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
                    <span style={{ color: '#666', fontSize: '15px' }}>${room.pricePerNight.toFixed(2)} × {nights} {nights === 1 ? 'night' : 'nights'}</span>
                    <span style={{ fontWeight: '700', fontSize: '16px', color: '#333' }}>${(room.pricePerNight * nights).toFixed(2)}</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    fontSize: '22px', 
                    fontWeight: '800',
                    paddingTop: '16px',
                    borderTop: '2px solid rgba(199, 146, 91, 0.3)'
                  }}>
                    <span style={{ color: '#333' }}>Total</span>
                    <span style={{ 
                      background: 'linear-gradient(135deg, #c7925b 0%, #8b6f47 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Book Now Button */}
              <button
                onClick={handleBookNow}
                style={{
                  width: '100%',
                  padding: '18px',
                  background: 'linear-gradient(135deg, #c7925b 0%, #8b6f47 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '14px',
                  fontSize: '18px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  boxShadow: '0 6px 20px rgba(199, 146, 91, 0.4)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #8b6f47 0%, #6b5a4a 100%)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(199, 146, 91, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #c7925b 0%, #8b6f47 100%)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(199, 146, 91, 0.4)';
                }}
              >
                <span style={{ position: 'relative', zIndex: 1 }}>✨ Reserve Now ✨</span>
              </button>

              <p style={{ 
                fontSize: '13px', 
                color: '#999', 
                textAlign: 'center', 
                marginTop: '18px',
                lineHeight: '1.5',
                fontStyle: 'italic'
              }}>
                💳 You won't be charged yet
              </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <GuestFooter />
    </div>
  );
};

export default RoomDetails;

