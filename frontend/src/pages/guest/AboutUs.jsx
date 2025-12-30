import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AboutUs.css';
import './GuestDashboard.css';
import GuestFooter from '../../components/GuestFooter.jsx';

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero Section - Outside container for full width */}
      <section className="hero-section-about">
        <div className="hero-bg-image"></div>
        <div className="hero-bg-overlay"></div>
        <div className="hero-content">
          <p className="hero-subtitle">LUXURY RETREATS</p>
          <h1 className="hero-title">LUXURYSTAY</h1>
        </div>
        <div className="property-cards">
          <div className="property-card">
            <img 
              src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80" 
              alt="Luxury Suite" 
              className="property-card-img"
            />
            <p className="property-card-title">Luxury Suite</p>
            <p className="property-card-subtitle">Premium accommodation with stunning views</p>
          </div>
          <div className="property-card">
            <img 
              src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80" 
              alt="Modern Bedroom" 
              className="property-card-img"
            />
            <p className="property-card-title">Modern Bedroom</p>
            <p className="property-card-subtitle">Elegant design meets comfort</p>
          </div>
          <div className="property-card">
            <img 
              src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&q=80" 
              alt="Ocean View" 
              className="property-card-img"
            />
            <p className="property-card-title">Ocean View</p>
            <p className="property-card-subtitle">Breathtaking panoramic vistas</p>
          </div>
        </div>
      </section>

      <div className="guest-page-container">
        <div className="about-us-page">
          {/* New Executives Section */}
          <section className="new-exectures">
            <div className="section-container">
              <div className="section-header">
                <p className="section-label">LuxuryStay Hospitality - Paradise</p>
                <h2 className="section-title">NEW EXECUTIVES</h2>
                <p className="section-description">
                  At LuxuryStay, we are proud to introduce our new executive team, bringing decades of combined experience 
                  in luxury hospitality. Our leadership is committed to elevating your experience to unprecedented heights. 
                  With a vision to redefine luxury hospitality, our executives bring innovative ideas and world-class 
                  service standards that set us apart in the industry.
                </p>
              </div>
              <div className="property-showcase">
                <div className="showcase-content">
                  <div className="content-stars">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#d4af37" stroke="#d4af37" strokeWidth="1">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#d4af37" stroke="#d4af37" strokeWidth="1">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#d4af37" stroke="#d4af37" strokeWidth="1">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#d4af37" stroke="#d4af37" strokeWidth="1">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#d4af37" stroke="#d4af37" strokeWidth="1">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  </div>
                  <span className="showcase-label">LUXURYSTAY HOSPITALITY</span>
                  <h3 className="showcase-title">Enjoy A Luxury<br/>Experience</h3>
                  <div className="showcase-text">
                    <p>
                      Welcome to LuxuryStay Hospitality. Here, every moment is crafted with precision and care, 
                      offering you an unparalleled experience of luxury and comfort. Our commitment to excellence 
                      is reflected in every detail, from our elegantly designed spaces to our world-class service.
                    </p>
                    <p>
                      Whether you seek a quiet retreat or a vibrant city experience, LuxuryStay provides the perfect 
                      setting for your journey. Our team is dedicated to ensuring that your stay exceeds expectations, 
                      creating memories that will last a lifetime.
                    </p>
                  </div>
                  <div className="reservation-info">
                    <div className="reservation-icon-wrapper">
                      <div className="reservation-icon">R</div>
                    </div>
                    <div className="reservation-details">
                      <span className="reservation-label">RESERVATION</span>
                      <span className="reservation-phone">+1 (555) 123-4567</span>
                    </div>
                  </div>
                </div>
                <div className="showcase-images">
                  <div className="showcase-image-item">
                    <div className="flip-card-inner">
                      <div className="flip-card-front">
                        <img 
                          src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80" 
                          alt="Luxury Lounge" 
                          className="showcase-img"
                        />
                      </div>
                      <div className="flip-card-back">
                        <img 
                          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80" 
                          alt="Luxury Resort" 
                          className="showcase-img"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="showcase-image-item">
                    <div className="flip-card-inner">
                      <div className="flip-card-front">
                        <img 
                          src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80" 
                          alt="Luxury Suite" 
                          className="showcase-img"
                        />
                      </div>
                      <div className="flip-card-back">
                        <img 
                          src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80" 
                          alt="Ocean View" 
                          className="showcase-img"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* New Context Section */}
          <section className="new-context">
            <div className="context-grid">
              <div className="context-content">
                <h2 className="context-title">New Contact:</h2>
                <p className="context-description">
                  Get in touch with our dedicated team for reservations, inquiries, or special requests. 
                  We're here to make your experience exceptional.
                </p>
                <ul className="context-list">
                  <li>Phone: +1 (555) 123-4567</li>
                  <li>Email: info@luxurystay.com</li>
                  <li>Address: 123 Luxury Avenue, Premium District</li>
                  <li>24/7 Concierge Service Available</li>
                  <li>Personalized Service and Exclusive Experiences</li>
                </ul>
              </div>
              <div className="context-image">
                <img 
                  src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80" 
                  alt="Luxury Room" 
                  className="context-image-img"
                />
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="features">
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24">
                    <rect x="3" y="5" width="18" height="14" rx="2"/>
                    <path d="M3 10h18M8 6v14"/>
                  </svg>
                </div>
                <h3 className="feature-title">Direct Contact</h3>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24">
                    <rect x="2" y="3" width="20" height="14" rx="2"/>
                    <path d="M8 21h8M12 17v4"/>
                  </svg>
                </div>
                <h3 className="feature-title">Virtual Tours</h3>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <h3 className="feature-title">Prime Location</h3>
              </div>
            </div>
            <div className="features-footer">
              <p>Experience unparalleled luxury and exceptional service</p>
              <p>at every moment of your stay with us</p>
              <h2>Quality and Create Memorable Experiences</h2>
            </div>
          </section>

          {/* Gallery Section */}
          <section className="gallery">
            <div className="gallery-grid">
              <div className="gallery-item">
                <img 
                  src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80" 
                  alt="Gallery 1" 
                  className="gallery-img"
                />
              </div>
              <div className="gallery-item">
                <img 
                  src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80" 
                  alt="Gallery 2" 
                  className="gallery-img"
                />
              </div>
              <div className="gallery-item">
                <img 
                  src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80" 
                  alt="Gallery 3" 
                  className="gallery-img"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
      <GuestFooter />
    </>
  );
};

export default AboutUs;
