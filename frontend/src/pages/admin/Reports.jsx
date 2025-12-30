import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout.jsx';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [occupancyData, setOccupancyData] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [reservationsData, setReservationsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboard();
    }
  }, [activeTab]);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/reports/dashboard');
      setDashboardData(response.data.dashboard);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOccupancy = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/reports/occupancy', {
        params: { startDate: dateRange.startDate, endDate: dateRange.endDate }
      });
      setOccupancyData(response.data.report);
    } catch (error) {
      console.error('Error fetching occupancy report:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRevenue = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/reports/revenue', {
        params: { startDate: dateRange.startDate, endDate: dateRange.endDate }
      });
      setRevenueData(response.data.report);
    } catch (error) {
      console.error('Error fetching revenue report:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/reports/reservations', {
        params: { startDate: dateRange.startDate, endDate: dateRange.endDate }
      });
      setReservationsData(response.data.report);
    } catch (error) {
      console.error('Error fetching reservations report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Reports" subtitle="Deep analytics for occupancy, revenue and reservations">
      <h2>Reports & Analytics</h2>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #ddd' }}>
        <button
          className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`btn ${activeTab === 'occupancy' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => { setActiveTab('occupancy'); fetchOccupancy(); }}
        >
          Occupancy
        </button>
        <button
          className={`btn ${activeTab === 'revenue' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => { setActiveTab('revenue'); fetchRevenue(); }}
        >
          Revenue
        </button>
        <button
          className={`btn ${activeTab === 'reservations' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => { setActiveTab('reservations'); fetchReservations(); }}
        >
          Reservations
        </button>
      </div>

      {activeTab !== 'dashboard' && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <label>Start Date:</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            />
            <label>End Date:</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            />
            <button className="btn btn-primary" onClick={() => {
              if (activeTab === 'occupancy') fetchOccupancy();
              if (activeTab === 'revenue') fetchRevenue();
              if (activeTab === 'reservations') fetchReservations();
            }}>
              Update
            </button>
          </div>
        </div>
      )}

      {activeTab === 'dashboard' && dashboardData && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div className="card">
            <h3>Today's Check-ins</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#007bff' }}>{dashboardData.todayCheckIns}</p>
          </div>
          <div className="card">
            <h3>Today's Check-outs</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745' }}>{dashboardData.todayCheckOuts}</p>
          </div>
          <div className="card">
            <h3>Occupancy Rate</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffc107' }}>{dashboardData.occupancyRate}%</p>
            <p>{dashboardData.occupiedRooms} / {dashboardData.totalRooms} rooms</p>
          </div>
          <div className="card">
            <h3>Today's Revenue</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745' }}>${dashboardData.todayRevenue.toFixed(2)}</p>
          </div>
          <div className="card">
            <h3>Pending Housekeeping</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc3545' }}>{dashboardData.pendingHousekeeping}</p>
          </div>
          <div className="card">
            <h3>Pending Maintenance</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc3545' }}>{dashboardData.pendingMaintenance}</p>
          </div>
        </div>
      )}

      {activeTab === 'occupancy' && occupancyData && (
        <div className="card">
          <h2>Occupancy Report</h2>
          <p><strong>Period:</strong> {new Date(occupancyData.period.start).toLocaleDateString()} - {new Date(occupancyData.period.end).toLocaleDateString()}</p>
          <p><strong>Average Occupancy Rate:</strong> {occupancyData.averageOccupancyRate}%</p>
          <p><strong>Total Rooms:</strong> {occupancyData.totalRooms}</p>
        </div>
      )}

      {activeTab === 'revenue' && revenueData && (
        <div className="card">
          <h2>Revenue Report</h2>
          <p><strong>Period:</strong> {new Date(revenueData.period.start).toLocaleDateString()} - {new Date(revenueData.period.end).toLocaleDateString()}</p>
          <p><strong>Total Revenue:</strong> ${revenueData.totalRevenue.toFixed(2)}</p>
          <p><strong>Room Revenue:</strong> ${revenueData.roomRevenue.toFixed(2)}</p>
          <p><strong>Services Revenue:</strong> ${revenueData.servicesRevenue.toFixed(2)}</p>
          <p><strong>Taxes Collected:</strong> ${revenueData.taxesCollected.toFixed(2)}</p>
          <p><strong>Total Bills:</strong> {revenueData.totalBills}</p>
        </div>
      )}

      {activeTab === 'reservations' && reservationsData && (
        <div className="card">
          <h2>Reservations Report</h2>
          <p><strong>Period:</strong> {new Date(reservationsData.period.start).toLocaleDateString()} - {new Date(reservationsData.period.end).toLocaleDateString()}</p>
          <p><strong>Total Reservations:</strong> {reservationsData.totalReservations}</p>
          <h3>Status Breakdown</h3>
          <ul>
            {Object.entries(reservationsData.statusBreakdown).map(([status, count]) => (
              <li key={status}>{status}: {count}</li>
            ))}
          </ul>
          <h3>Room Type Breakdown</h3>
          <ul>
            {Object.entries(reservationsData.roomTypeBreakdown).map(([type, count]) => (
              <li key={type}>{type}: {count}</li>
            ))}
          </ul>
        </div>
      )}
    </AdminLayout>
  );
};

export default Reports;

