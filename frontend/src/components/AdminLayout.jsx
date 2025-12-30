import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import NotificationBell from './NotificationBell.jsx';
import './AdminLayout.css';

const AdminLayout = ({ title, subtitle, children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`admin-shell ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="admin-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="admin-brand">
            <span className="admin-brand-logo">LS</span>
            <div className="admin-brand-text">
              <span className="brand-title">LuxuryStay</span>
              <span className="brand-subtitle">Admin Panel</span>
            </div>
          </div>

          <nav className="admin-menu">
            <div className="admin-menu-section">Main</div>
            <Link to="/dashboard" className={`admin-menu-item ${isActive('/dashboard') ? 'active' : ''}`}>
              <span className="icon">📊</span>
              <span>Dashboard</span>
            </Link>
            {/* Users - Admin only */}
            {user?.role === 'admin' && (
              <Link to="/users" className={`admin-menu-item ${isActive('/users') ? 'active' : ''}`}>
                <span className="icon">👥</span>
                <span>Users</span>
              </Link>
            )}
            {/* Rooms */}
            <Link to="/rooms" className={`admin-menu-item ${isActive('/rooms') ? 'active' : ''}`}>
              <span className="icon">🛏️</span>
              <span>Rooms</span>
            </Link>
            {/* Reservations */}
            <Link to="/reservations" className={`admin-menu-item ${isActive('/reservations') ? 'active' : ''}`}>
              <span className="icon">📝</span>
              <span>Reservations</span>
            </Link>
            {/* Billing */}
            <Link to="/billing" className={`admin-menu-item ${isActive('/billing') ? 'active' : ''}`}>
              <span className="icon">💳</span>
              <span>Billing</span>
            </Link>
            {/* Reports - Admin only */}
            {user?.role === 'admin' && (
              <Link to="/reports" className={`admin-menu-item ${isActive('/reports') ? 'active' : ''}`}>
                <span className="icon">📈</span>
                <span>Reports</span>
              </Link>
            )}

            {/* Content section */}
            <div className="admin-menu-section">Content</div>
            <Link to="/admin/gallery" className={`admin-menu-item ${isActive('/admin/gallery') ? 'active' : ''}`}>
              <span className="icon">🖼️</span>
              <span>Gallery</span>
            </Link>
            {/* Settings - Admin only */}
            {user?.role === 'admin' && (
              <Link to="/settings" className={`admin-menu-item ${isActive('/settings') ? 'active' : ''}`}>
                <span className="icon">⚙️</span>
                <span>Settings</span>
              </Link>
            )}
          </nav>

          {/* Sidebar Footer - User Info and Actions */}
          <div className="admin-sidebar-footer">
            <div className="admin-sidebar-search">
              <input type="text" placeholder="Search..." />
            </div>
            <div className="admin-sidebar-user">
              <div className="avatar">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="info">
                <span className="name">{user?.firstName} {user?.lastName}</span>
                <span className="role">{user?.role}</span>
              </div>
            </div>
            <div className="admin-sidebar-actions">
              <NotificationBell />
              <button className="logout-btn" type="button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main Area */}
        <div className="admin-main">
          <div className="admin-page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
              <button
                type="button"
                className="sidebar-toggle"
                aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                onClick={() => setSidebarCollapsed((prev) => !prev)}
              >
                ☰
              </button>
              <div className="admin-title-block">
                <h1>{title}</h1>
                {subtitle && <p>{subtitle}</p>}
              </div>
            </div>
            <div className="admin-header-right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <NotificationBell />
              <button onClick={handleLogout} className="Btn" type="button" aria-label="Logout" style={{ marginLeft: '12px' }}>
                <div className="sign">
                  <svg viewBox="0 0 512 512">
                    <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                  </svg>
                </div>
                <div className="text">Logout</div>
              </button>
            </div>
          </div>

          <main className="admin-content">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

