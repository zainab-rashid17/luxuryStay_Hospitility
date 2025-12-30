import React, { useContext, useEffect } from 'react';
import axios from 'axios';


import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Navbar from './components/Navbar.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import RoleBasedDashboard from './pages/RoleBasedDashboard.jsx';

// Admin/Manager imports
import AdminUsers from './pages/admin/Users.jsx';
import AdminRooms from './pages/admin/Rooms.jsx';
import AdminReservations from './pages/admin/Reservations.jsx';
import AdminBilling from './pages/admin/Billing.jsx';
import AdminHousekeeping from './pages/admin/Housekeeping.jsx';
import AdminMaintenance from './pages/admin/Maintenance.jsx';
import AdminReports from './pages/admin/Reports.jsx';
import AdminSettings from './pages/admin/Settings.jsx';
import AdminGallery from './pages/admin/Gallery.jsx';

// Guest imports
import GuestReservations from './pages/guest/Reservations.jsx';
import GuestRooms from './pages/guest/Rooms.jsx';
import GuestRoomDetails from './pages/guest/RoomDetails.jsx';
import GuestBilling from './pages/guest/Billing.jsx';
import GuestServices from './pages/guest/Services.jsx';
import GuestFeedback from './pages/guest/Feedback.jsx';
import GuestGallery from './pages/guest/Gallery.jsx';
import GuestAboutUs from './pages/guest/AboutUs.jsx';
import Notifications from './pages/Notifications.jsx';

import './App.css';

// Configuration for Deployment
// In production, this will use the variable from Vercel/Netlify.
// In development, it defaults to localhost:5000.
// You MUST set REACT_APP_API_URL in your Vercel project settings to your Render backend URL.
axios.defaults.baseURL = process.env.NODE_ENV === 'production'
  ? (process.env.REACT_APP_API_URL || 'https://luxurystay-backend.onrender.com') // Fallback/Placeholder
  : 'http://localhost:5000'; // Local backend

// Note: If using the proxy in package.json, we typically don't set this for dev, 
// but setting it explicitly helps strictly separate frontend/backend for deployment logic.

// Home Component
const Home = () => {
  useEffect(() => {
    // Animate statistics on scroll
    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const statNumbers = entry.target.querySelectorAll('.stat-number');
          statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
              current += increment;
              if (current < target) {
                stat.textContent = Math.floor(current).toLocaleString() + (target >= 1000 ? '+' : target === 98 ? '%' : '+');
                requestAnimationFrame(updateCounter);
              } else {
                stat.textContent = target.toLocaleString() + (target >= 1000 ? '+' : target === 98 ? '%' : '+');
              }
            };
            updateCounter();
          });
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) observer.observe(statsSection);

    return () => {
      if (statsSection) observer.unobserve(statsSection);
    };
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Welcome to LuxuryStay Hospitality</h1>
          <p className="hero-subtitle">
            Experience unparalleled luxury and exceptional service at our world-class hotels
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary btn-hero">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-outline btn-hero">
              Sign In
            </Link>
          </div>
        </div>
        <div className="hero-scroll">
          <span>Scroll to explore</span>
          <div className="scroll-arrow">↓</div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="container">
          <h2 className="stats-section-title">Our Achievements</h2>
          <p className="stats-section-subtitle">Numbers that speak for our excellence</p>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number" data-count="50000">0</div>
              <div className="stat-label">Happy Guests</div>
            </div>
            <div className="stat-item">
              <div className="stat-number" data-count="150">0</div>
              <div className="stat-label">Luxury Rooms</div>
            </div>
            <div className="stat-item">
              <div className="stat-number" data-count="25">0</div>
              <div className="stat-label">Awards Won</div>
            </div>
            <div className="stat-item">
              <div className="stat-number" data-count="98">0</div>
              <div className="stat-label">% Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose LuxuryStay?</h2>
          <p className="section-subtitle">
            Discover the perfect blend of comfort, elegance, and world-class service
          </p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🏨</div>
              <h3>Luxurious Rooms</h3>
              <p>
                Spacious, elegantly designed rooms with premium amenities and breathtaking views
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🍽️</div>
              <h3>Fine Dining</h3>
              <p>
                Exquisite culinary experiences with world-renowned chefs and diverse cuisine options
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3>Premium Services</h3>
              <p>
                Personalized concierge services, spa treatments, and exclusive amenities
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Prime Locations</h3>
              <p>
                Strategically located in the heart of major cities and scenic destinations
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💼</div>
              <h3>Business Facilities</h3>
              <p>
                State-of-the-art meeting rooms and business centers for corporate travelers
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>5-Star Experience</h3>
              <p>
                Award-winning hospitality with attention to every detail for your comfort
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">What Our Guests Say</h2>
          <p className="section-subtitle">Don't just take our word for it - hear from our satisfied guests</p>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "An absolutely amazing experience! The service was impeccable and the rooms were beyond luxurious. Will definitely return!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">SM</div>
                <div className="author-info">
                  <div className="author-name">Sarah Mitchell</div>
                  <div className="author-title">Business Executive</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "The best hotel experience I've ever had. Every detail was perfect, from check-in to check-out. Truly exceptional!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">JD</div>
                <div className="author-info">
                  <div className="author-name">James Davis</div>
                  <div className="author-title">Travel Blogger</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "LuxuryStay exceeded all expectations. The staff was incredibly attentive and the facilities were world-class!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">EW</div>
                <div className="author-info">
                  <div className="author-name">Emily Wilson</div>
                  <div className="author-title">Frequent Traveler</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <h2 className="section-title">Our Services</h2>
          <div className="services-grid">
            <div className="service-item">
              <h4>Room Reservations</h4>
              <p>Easy online booking with instant confirmation</p>
            </div>
            <div className="service-item">
              <h4>Check-in/Check-out</h4>
              <p>Streamlined processes for a seamless experience</p>
            </div>
            <div className="service-item">
              <h4>Billing & Invoicing</h4>
              <p>Transparent pricing with detailed billing</p>
            </div>
            <div className="service-item">
              <h4>Housekeeping</h4>
              <p>Professional cleaning and maintenance services</p>
            </div>
            <div className="service-item">
              <h4>Guest Services</h4>
              <p>24/7 concierge and personalized assistance</p>
            </div>
            <div className="service-item">
              <h4>Feedback System</h4>
              <p>Your voice matters - help us improve</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Experience Luxury?</h2>
            <p>Join thousands of satisfied guests who have made LuxuryStay their preferred choice</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary btn-large">
                Create Account
              </Link>
              <Link to="/login" className="btn btn-outline btn-large">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>LuxuryStay Hospitality</h4>
              <p>Your gateway to luxury and comfort</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>Email: info@luxurystay.com</p>
              <p>Phone: +1 (555) 123-4567</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 LuxuryStay Hospitality. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Role-based component wrapper - must be inside AuthProvider
// Now supports only two panels: admin and guest
const RoleBasedComponent = ({ adminComponent, guestComponent, defaultComponent }) => {
  const { user } = useContext(AuthContext);

  if (!user) return defaultComponent || guestComponent || adminComponent;

  switch (user.role) {
    case 'admin':
      return adminComponent;
    case 'guest':
      return guestComponent;
    default:
      return defaultComponent || guestComponent || adminComponent;
  }
};

// Wrapper component for routes that need role-based rendering
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <RoleBasedDashboard />
          </PrivateRoute>
        }
      />
      {/* Users - Admin only */}
      <Route
        path="/users"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminUsers />
          </PrivateRoute>
        }
      />
      {/* Rooms - Role-based */}
      <Route
        path="/rooms"
        element={
          <PrivateRoute>
            <RoleBasedComponent
              adminComponent={<AdminRooms />}
              guestComponent={<GuestRooms />}
              defaultComponent={<GuestRooms />}
            />
          </PrivateRoute>
        }
      />
      {/* Reservations - Role-based */}
      <Route
        path="/reservations"
        element={
          <PrivateRoute>
            <RoleBasedComponent
              adminComponent={<AdminReservations />}
              guestComponent={<GuestReservations />}
              defaultComponent={<GuestReservations />}
            />
          </PrivateRoute>
        }
      />
      {/* Billing - Role-based */}
      <Route
        path="/billing"
        element={
          <PrivateRoute>
            <RoleBasedComponent
              adminComponent={<AdminBilling />}
              guestComponent={<GuestBilling />}
              defaultComponent={<GuestBilling />}
            />
          </PrivateRoute>
        }
      />
      {/* Housekeeping - Role-based */}
      <Route
        path="/housekeeping"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminHousekeeping />
          </PrivateRoute>
        }
      />
      {/* Maintenance - Role-based */}
      <Route
        path="/maintenance"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminMaintenance />
          </PrivateRoute>
        }
      />
      {/* Reports - Admin/Manager only */}
      <Route
        path="/reports"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminReports />
          </PrivateRoute>
        }
      />
      {/* Settings - Admin only */}
      <Route
        path="/settings"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminSettings />
          </PrivateRoute>
        }
      />
      {/* Gallery Management - Admin/Manager */}
      <Route
        path="/admin/gallery"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminGallery />
          </PrivateRoute>
        }
      />
      {/* Services - Guest */}
      <Route
        path="/services"
        element={
          <PrivateRoute>
            <GuestServices />
          </PrivateRoute>
        }
      />
      {/* Feedback - Guest */}
      <Route
        path="/feedback"
        element={
          <PrivateRoute>
            <GuestFeedback />
          </PrivateRoute>
        }
      />
      {/* Gallery - Guest */}
      <Route
        path="/gallery"
        element={
          <PrivateRoute>
            <GuestGallery />
          </PrivateRoute>
        }
      />
      {/* About Us - Guest */}
      <Route
        path="/about"
        element={
          <PrivateRoute>
            <GuestAboutUs />
          </PrivateRoute>
        }
      />
      {/* Notifications - All authenticated users */}
      <Route
        path="/notifications"
        element={
          <PrivateRoute>
            <Notifications />
          </PrivateRoute>
        }
      />
      {/* Room Details - Guest */}
      <Route
        path="/rooms/:id"
        element={
          <PrivateRoute>
            <GuestRoomDetails />
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Home />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const path = location.pathname;
  const { user } = useContext(AuthContext);

  // Admin routes that use AdminLayout (with sidebar, no navbar)
  // Note: /dashboard is role-based, so we check user role separately
  const adminLikeRoutes = [
    '/users', // Admin/Manager only
    '/admin/rooms', // Admin rooms management
    '/admin/reservations', // Admin reservations
    '/admin/billing', // Admin billing
    '/admin/housekeeping', // Admin housekeeping
    '/admin/maintenance', // Admin maintenance
    '/admin/reports', // Admin reports
    '/reports', // Reports page (Admin/Manager)
    '/admin/gallery', // Admin gallery
    '/settings', // Admin settings
    '/housekeeping/tasks', // Housekeeping routes
    '/housekeeping/maintenance', // Housekeeping routes
  ];

  // Role-based routes that can be accessed by both admin and guest
  const roleBasedRoutes = ['/rooms', '/reservations', '/billing', '/housekeeping', '/maintenance'];

  // Check if current route is an admin-like route
  const isAdminLayoutRoute = adminLikeRoutes.some((route) => path.startsWith(route));

  // Check if /dashboard is accessed by admin-like user (not guest)
  const isDashboardAdminRoute = path === '/dashboard' && user && user.role === 'admin';

  // Check if current route is a role-based route accessed by admin-like user
  const isRoleBasedRoute = roleBasedRoutes.some((route) => path === route || path.startsWith(route + '/'));
  const isAdminUser = user && user.role === 'admin';
  const isRoleBasedAdminRoute = isRoleBasedRoute && isAdminUser;

  const useFullWidth = path === '/' || isAdminLayoutRoute || isDashboardAdminRoute || isRoleBasedAdminRoute;

  // Hide navbar on login, register, and admin pages (admin pages use sidebar)
  // Guest routes (/dashboard, /reservations, /rooms, /billing, etc.) should show navbar
  const hideNavbar = path === '/login' || path === '/register' || isAdminLayoutRoute || isDashboardAdminRoute || isRoleBasedAdminRoute;

  return (
    <div className="App">
      {!hideNavbar && <Navbar />}
      {useFullWidth || hideNavbar ? (
        <AppRoutes />
      ) : (
        <div className="container">
          <AppRoutes />
        </div>
      )}
    </div>
  );
}

export default App;