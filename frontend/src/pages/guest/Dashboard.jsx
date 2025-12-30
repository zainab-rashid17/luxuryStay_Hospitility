import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext.jsx';
import GuestFooter from '../../components/GuestFooter.jsx';
import './GuestDashboard.css'; // Import the CSS file

const GuestDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [stats, setStats] = useState({
    totalStays: 0,
    upcomingTrips: 0,
    loyaltyPoints: 0,
    savedAmount: 0
  });
  const [loading, setLoading] = useState(true);

  const carouselImages = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80',
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1920&q=80',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&q=80'
  ];

  // Auto carousel effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  // Fetch user stats
  useEffect(() => {
    fetchUserStats();
  }, [user]);

  const fetchUserStats = async () => {
    if (!user?._id) return;
    
    try {
      setLoading(true);
      // Fetch all reservations for the guest
      const response = await axios.get('/api/reservations', {
        params: { guestId: user._id }
      });
      
      const reservations = response.data.reservations || [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Calculate total stays (completed reservations)
      const totalStays = reservations.filter(r => 
        r.status === 'checked-out' || r.status === 'completed'
      ).length;

      // Calculate upcoming trips (confirmed or checked-in with future check-in date)
      const upcomingTrips = reservations.filter(r => {
        if (r.status === 'checked-in') return true;
        if (r.status === 'confirmed') {
          const checkInDate = new Date(r.checkInDate);
          checkInDate.setHours(0, 0, 0, 0);
          return checkInDate >= today;
        }
        return false;
      }).length;

      // Calculate loyalty points (10 points per stay, 5 points per upcoming trip)
      const loyaltyPoints = (totalStays * 10) + (upcomingTrips * 5);

      // Calculate saved amount (assuming 10% discount on average, or based on actual discounts)
      const totalSpent = reservations
        .filter(r => r.status === 'checked-out' || r.status === 'completed')
        .reduce((sum, r) => {
          const nights = Math.ceil((new Date(r.checkOutDate) - new Date(r.checkInDate)) / (1000 * 60 * 60 * 24));
          const total = (r.roomId?.pricePerNight || 0) * nights;
          return sum + total;
        }, 0);
      
      // Assuming 10% average savings through loyalty program
      const savedAmount = Math.round(totalSpent * 0.1);

      setStats({
        totalStays,
        upcomingTrips,
        loyaltyPoints,
        savedAmount
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
      // Set default values on error
      setStats({
        totalStays: 0,
        upcomingTrips: 0,
        loyaltyPoints: 0,
        savedAmount: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="guest-dashboard-container">
      {/* Image Carousel */}
      <div className="dashboard-carousel">
        <div 
          className="carousel-wrapper"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {carouselImages.map((image, index) => (
            <div key={index} className="carousel-slide">
              <img src={image} alt={`Luxury Stay ${index + 1}`} className="carousel-image" />
              <div className="carousel-overlay"></div>
            </div>
          ))}
        </div>
        
        {/* Carousel Indicators */}
        <div className="carousel-indicators">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              className={`carousel-indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="dashboard-content-wrapper">
        <div className="welcome-banner-card">
          <div className="welcome-banner-content">
            <div className="welcome-greeting">
              <h2 className="welcome-title">Welcome back, {user?.firstName || 'Guest'}!</h2>
              <p className="welcome-message">We're delighted to have you with us. Your luxury experience awaits.</p>
            </div>
            <div className="welcome-stats">
              <div className="welcome-stat-item">
                <div className="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                </div>
                <div className="stat-info">
                  <div className="stat-value">
                    {loading ? (
                      <span className="stat-loading">...</span>
                    ) : (
                      stats.totalStays
                    )}
                  </div>
                  <div className="stat-label">Total Stays</div>
                </div>
              </div>
              <div className="welcome-stat-item">
                <div className="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div className="stat-info">
                  <div className="stat-value">
                    {loading ? (
                      <span className="stat-loading">...</span>
                    ) : (
                      stats.upcomingTrips
                    )}
                  </div>
                  <div className="stat-label">Upcoming</div>
                </div>
              </div>
              <div className="welcome-stat-item">
                <div className="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                </div>
                <div className="stat-info">
                  <div className="stat-value">
                    {loading ? (
                      <span className="stat-loading">...</span>
                    ) : (
                      stats.loyaltyPoints.toLocaleString()
                    )}
                  </div>
                  <div className="stat-label">Loyalty Points</div>
                </div>
              </div>
              <div className="welcome-stat-item">
                <div className="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                <div className="stat-info">
                  <div className="stat-value">
                    {loading ? (
                      <span className="stat-loading">...</span>
                    ) : (
                      `$${stats.savedAmount.toLocaleString()}`
                    )}
                  </div>
                  <div className="stat-label">Saved</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Separator */}
      <div className="section-separator">
        <div className="separator-line"></div>
        <div className="separator-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
        </div>
        <div className="separator-line"></div>
      </div>

      {/* Features Section */}
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h2 className="section-title section-title-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <span>Why Choose LuxuryStay</span>
        </h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3 className="feature-title">24/7 Concierge Service</h3>
            <p className="feature-description">
              Our dedicated concierge team is available round the clock to assist you with any request, ensuring your stay is seamless and memorable.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
            </div>
            <h3 className="feature-title">Premium Amenities</h3>
            <p className="feature-description">
              Enjoy world-class amenities including spa services, fine dining restaurants, fitness centers, and exclusive access to premium facilities.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <h3 className="feature-title">Prime Locations</h3>
            <p className="feature-description">
              Strategically located in the heart of the city, providing easy access to major attractions, business districts, and entertainment venues.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"></path>
                <line x1="7" y1="7" x2="7.01" y2="7"></line>
              </svg>
            </div>
            <h3 className="feature-title">Personalized Service</h3>
            <p className="feature-description">
              Every detail of your stay is tailored to your preferences, from room selection to dining recommendations and special arrangements.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0110 0v4"></path>
              </svg>
            </div>
            <h3 className="feature-title">Secure & Safe</h3>
            <p className="feature-description">
              Your safety and security are our top priorities with advanced security systems and 24/7 monitoring throughout the property.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 00-3-3.87"></path>
                <path d="M16 3.13a4 4 0 010 7.75"></path>
              </svg>
            </div>
            <h3 className="feature-title">Expert Staff</h3>
            <p className="feature-description">
              Our highly trained and professional staff members are committed to providing exceptional service and creating unforgettable experiences.
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Separator */}
      <div className="section-separator">
        <div className="separator-line"></div>
        <div className="separator-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
          </svg>
        </div>
        <div className="separator-line"></div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h2 className="section-title section-title-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span>Quick Actions</span>
        </h2>
        <div className="actions-grid">
          <a href="/reservations" className="action-button action-card-1">
              <div className="action-icon-wrapper">
                <div className="action-icon action-icon-1">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                </div>
                <div className="action-glow action-glow-1"></div>
              </div>
              <div className="action-content">
              <span className="action-label">View All Reservations</span>
                <span className="action-description">Check your booking history</span>
                <span className="action-arrow">→</span>
              </div>
            </a>
            
          <a href="/rooms" className="action-button action-card-2">
              <div className="action-icon-wrapper">
                <div className="action-icon action-icon-2">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                </div>
                <div className="action-glow action-glow-2"></div>
              </div>
              <div className="action-content">
              <span className="action-label">Browse Rooms</span>
                <span className="action-description">Explore available suites</span>
                <span className="action-arrow">→</span>
              </div>
            </a>
            
          <a href="/services" className="action-button action-card-3">
              <div className="action-icon-wrapper">
                <div className="action-icon action-icon-3">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"></path>
                </svg>
                </div>
                <div className="action-glow action-glow-3"></div>
              </div>
              <div className="action-content">
              <span className="action-label">Request Service</span>
                <span className="action-description">Get assistance anytime</span>
                <span className="action-arrow">→</span>
              </div>
            </a>
            
          <a href="/feedback" className="action-button action-card-4">
              <div className="action-icon-wrapper">
                <div className="action-icon action-icon-4">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
                <div className="action-glow action-glow-4"></div>
              </div>
              <div className="action-content">
              <span className="action-label">Leave Feedback</span>
                <span className="action-description">Share your experience</span>
                <span className="action-arrow">→</span>
              </div>
            </a>
            
          <a href="/billing" className="action-button action-card-5">
              <div className="action-icon-wrapper">
                <div className="action-icon action-icon-5">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
                </div>
                <div className="action-glow action-glow-5"></div>
              </div>
              <div className="action-content">
              <span className="action-label">View Bills</span>
                <span className="action-description">Access invoices & receipts</span>
                <span className="action-arrow">→</span>
              </div>
            </a>
          
          <a href="/support" className="action-button action-card-6">
              <div className="action-icon-wrapper">
                <div className="action-icon action-icon-6">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"></path>
                    <line x1="9" y1="10" x2="15" y2="10"></line>
                    <line x1="9" y1="14" x2="13" y2="14"></line>
                  </svg>
                </div>
                <div className="action-glow action-glow-6"></div>
              </div>
              <div className="action-content">
                <span className="action-label">Contact Support</span>
                <span className="action-description">24/7 help available</span>
                <span className="action-arrow">→</span>
              </div>
            </a>
          </div>
        </div>

      <GuestFooter />
    </div>
  );
};

export default GuestDashboard;