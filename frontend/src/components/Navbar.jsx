import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import NotificationBell from './NotificationBell.jsx';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            <div className="logo-container">
              <img src="/logo.png" alt="LuxuryStay Logo" className="logo-image" />
              <span className="logo-text">
                <span className="logo-main">LUXURY</span>
                <span className="logo-sub">STAY</span>
              </span>
            </div>
          </Link>
          <div className="navbar-links">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
          <Link to="/dashboard" className="navbar-brand">
            <div className="logo-container">
              <div className="logo-emblem">
                <svg width="50" height="50" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Crown */}
                  <path d="M50 5 L45 20 L35 18 L40 30 L30 28 L35 40 L50 35 L65 40 L70 28 L60 30 L65 18 L55 20 Z" fill="url(#goldGradientNav3)" stroke="#b8941f" strokeWidth="1"/>
                  {/* Building */}
                  <rect x="30" y="40" width="40" height="35" fill="url(#goldGradientNav3)" stroke="#b8941f" strokeWidth="1.5"/>
                  <rect x="35" y="45" width="8" height="8" fill="#b8941f" opacity="0.3"/>
                  <rect x="47" y="45" width="8" height="8" fill="#b8941f" opacity="0.3"/>
                  <rect x="57" y="45" width="8" height="8" fill="#b8941f" opacity="0.3"/>
                  <rect x="35" y="57" width="8" height="8" fill="#b8941f" opacity="0.3"/>
                  <rect x="47" y="57" width="8" height="8" fill="#b8941f" opacity="0.3"/>
                  <rect x="57" y="57" width="8" height="8" fill="#b8941f" opacity="0.3"/>
                  {/* Wings */}
                  <path d="M30 50 L15 45 L10 55 L20 60 L30 50" fill="url(#goldGradientNav3)" stroke="#b8941f" strokeWidth="1"/>
                  <path d="M70 50 L85 45 L90 55 L80 60 L70 50" fill="url(#goldGradientNav3)" stroke="#b8941f" strokeWidth="1"/>
                  {/* Base */}
                  <path d="M25 75 Q50 80 75 75 L75 85 Q50 90 25 85 Z" fill="url(#goldGradientNav3)" stroke="#b8941f" strokeWidth="1"/>
                  <defs>
                    <linearGradient id="goldGradientNav3" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{stopColor:"#d4af37", stopOpacity:1}} />
                      <stop offset="50%" style={{stopColor:"#f0c850", stopOpacity:1}} />
                      <stop offset="100%" style={{stopColor:"#b8941f", stopOpacity:1}} />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span className="logo-text">
                <span className="logo-main">LUXURY</span>
                <span className="logo-sub">STAY</span>
              </span>
            </div>
          </Link>
        <div className="navbar-links">
          <Link to="/dashboard">Dashboard</Link>
          {user.role === 'admin' && (
            <Link to="/users">Users</Link>
          )}
          {/* Shared admin/guest routes */}
          {['admin', 'guest'].includes(user.role) && (
            <Link to="/rooms">Rooms</Link>
          )}
          {['admin', 'guest'].includes(user.role) && (
            <Link to="/reservations">Reservations</Link>
          )}
          {['admin', 'guest'].includes(user.role) && (
            <Link to="/billing">Billing</Link>
          )}
          {/* Admin-only operational pages (housekeeping/maintenance removed from nav) */}
          {user.role === 'admin' && (
            <Link to="/reports">Reports</Link>
          )}
          {user.role === 'admin' && (
            <Link to="/settings">Settings</Link>
          )}
          {user.role === 'admin' && (
            <Link to="/admin/gallery">Gallery Management</Link>
          )}
          {['admin', 'guest'].includes(user.role) && (
            <Link to="/feedback">Feedback</Link>
          )}
          {['admin', 'guest'].includes(user.role) && (
            <Link to="/services">Services</Link>
          )}
          {user.role === 'guest' && (
            <Link to="/gallery">Gallery</Link>
          )}
          {user.role === 'guest' && (
            <Link to="/about">About Us</Link>
          )}
          <NotificationBell />
          
          
          <span className="navbar-user">Welcome, {user.firstName} ({user.role})</span>
          <button onClick={handleLogout} className="Btn">
            <div className="sign">
              <svg viewBox="0 0 512 512">
                <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
              </svg>
            </div>
            <div className="text">Logout</div>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


