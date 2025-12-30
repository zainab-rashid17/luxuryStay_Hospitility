import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import AdminDashboard from './admin/Dashboard.jsx';
import GuestDashboard from './guest/Dashboard.jsx';

const RoleBasedDashboard = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Only two panels: admin and guest
  if (user.role === 'admin') {
    return <AdminDashboard />;
  }

  // Default to guest dashboard for any non-admin user
  return <GuestDashboard />;
};

export default RoleBasedDashboard;

