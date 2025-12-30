import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout.jsx';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('/api/reports/dashboard');
      if (response.data.success && response.data.dashboard) {
        setStats(response.data.dashboard);
        console.log('✅ Dashboard data loaded from database:', response.data.dashboard);
        console.log('📊 Weekly data:', response.data.dashboard.weeklyData);
      } else {
        console.error('Invalid response format:', response.data);
        setStats(getFallbackStats());
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Only use fallback if there's a real error, not if data is just empty
      if (error.response?.status !== 401) {
        setStats(getFallbackStats());
      }
    } finally {
      setLoading(false);
    }
  };

  const getFallbackStats = () => ({
    todayCheckIns: 8,
    todayCheckOuts: 5,
    totalRooms: 25,
    occupiedRooms: 18,
    occupancyRate: 72,
    todayRevenue: 12450.75,
    pendingHousekeeping: 3,
    pendingMaintenance: 2,
    weeklyData: [65, 72, 68, 75, 80, 78, 72], // Sample weekly occupancy data
  });

  const occupiedRooms = stats?.occupiedRooms || 0;
  const totalRooms = stats?.totalRooms || 0;
  const availableRooms = Math.max(totalRooms - occupiedRooms, 0);
  const occupancyPercent = stats?.occupancyRate || 0;

  const dashboardTitle = 'Dashboard';
  const dashboardSubtitle = 'Coffee-brown overview of your LuxuryStay operations';

  return (
    <AdminLayout title={dashboardTitle} subtitle={dashboardSubtitle}>
      {stats && (
        <>
          {/* Top metric cards */}
          <div className="grid grid-4 mb-3">
            <div className="card">
              <h3>Today's Check-ins</h3>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#6d4c41' }}>{stats.todayCheckIns || 0}</p>
              <span style={{ fontSize: '12px', color: '#8d6e63' }}>Guests arriving today</span>
            </div>
            <div className="card">
              <h3>Today's Check-outs</h3>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#a1887f' }}>{stats.todayCheckOuts || 0}</p>
              <span style={{ fontSize: '12px', color: '#8d6e63' }}>Departing guests</span>
            </div>
            <div className="card">
              <h3>Occupancy Rate</h3>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffb74d' }}>{stats.occupancyRate || 0}%</p>
              <span style={{ fontSize: '12px', color: '#8d6e63' }}>{stats.occupiedRooms || 0} / {stats.totalRooms || 0} rooms occupied</span>
            </div>
            <div className="card">
              <h3>Today's Revenue</h3>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffcc80' }}>${(stats.todayRevenue || 0).toFixed(2)}</p>
              <span style={{ fontSize: '12px', color: '#8d6e63' }}>Front-desk + online bookings</span>
            </div>
          </div>

          {/* Chart + side widgets layout similar to reference UI */}
          <div className="admin-dashboard-grid">
            {/* Weekly Recap / placeholder chart */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div>
                  <h2>Weekly Recap</h2>
                  <p style={{ fontSize: '12px', color: '#8d6e63' }}>Occupancy & revenue trend</p>
                </div>
                <select style={{ padding: '6px 10px', borderRadius: 999, border: '1px solid #d7ccc8', fontSize: '12px' }}>
                  <option>This Week</option>
                  <option>Last Week</option>
                </select>
              </div>

              {/* Simple chart-style visualization using CSS only */}
              <div style={{ 
                height: 260, 
                display: 'flex', 
                alignItems: 'flex-end', 
                justifyContent: 'space-around',
                gap: 8, 
                padding: '20px 10px 30px 10px', 
                minHeight: '260px',
                position: 'relative'
              }}>
                {(() => {
                  // Use real weekly data from API or fallback to sample data
                  const weeklyData = stats?.weeklyData || [65, 72, 68, 75, 80, 78, 72];
                  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
                  
                  // Ensure we have 7 data points
                  const chartData = weeklyData.length === 7 ? weeklyData : [...weeklyData, ...Array(7 - weeklyData.length).fill(0)].slice(0, 7);
                  
                  // Find max value for scaling
                  const maxValue = Math.max(...chartData.map(v => Number(v) || 0), 100);
                  
                  return chartData.map((value, index) => {
                    // Ensure value is a valid number and within 0-100 range
                    const chartValue = Math.min(Math.max(Number(value) || 0, 0), 100);
                    // Scale height based on max value (0-100% of chart height)
                    const barHeight = maxValue > 0 ? (chartValue / maxValue) * 100 : 0;
                    // Minimum height of 8% so bars are always visible
                    const finalHeight = Math.max(barHeight, 8);
                    
                    return (
                      <div 
                        key={index} 
                        style={{ 
                          flex: 1, 
                          display: 'flex', 
                          flexDirection: 'column', 
                          justifyContent: 'flex-end', 
                          alignItems: 'center', 
                          gap: 8, 
                          minWidth: '45px',
                          maxWidth: '80px',
                          position: 'relative'
                        }}
                      >
                        {/* Bar */}
                        <div
                          style={{
                            width: '100%',
                            minWidth: '35px',
                            height: `${finalHeight}%`,
                            minHeight: '20px',
                            maxHeight: '220px',
                            borderRadius: '8px 8px 4px 4px',
                            background: chartValue > 0 
                              ? 'linear-gradient(180deg, #ffcc80 0%, #ffb74d 50%, #c7925b 100%)' 
                              : 'linear-gradient(180deg, #e0e0e0, #bdbdbd)',
                            boxShadow: chartValue > 0 
                              ? '0 4px 12px rgba(199, 146, 91, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)' 
                              : '0 2px 4px rgba(0,0,0,0.1)',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            opacity: chartValue > 0 ? 1 : 0.4,
                            border: chartValue > 0 ? '1px solid rgba(199, 146, 91, 0.3)' : '1px solid rgba(0,0,0,0.1)',
                            cursor: 'pointer',
                            position: 'relative',
                          }}
                          title={`${dayLabels[index]}: ${chartValue}% occupancy`}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scaleY(1.05)';
                            e.currentTarget.style.boxShadow = '0 6px 16px rgba(199, 146, 91, 0.5)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scaleY(1)';
                            e.currentTarget.style.boxShadow = chartValue > 0 
                              ? '0 4px 12px rgba(199, 146, 91, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)' 
                              : '0 2px 4px rgba(0,0,0,0.1)';
                          }}
                        >
                          {/* Value label on bar */}
                          {chartValue > 0 && (
                            <div style={{
                              position: 'absolute',
                              top: '-20px',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              fontSize: '11px',
                              fontWeight: 700,
                              color: '#6d4c41',
                              whiteSpace: 'nowrap',
                              textShadow: '0 1px 2px rgba(255,255,255,0.8)'
                            }}>
                              {chartValue}%
                            </div>
                          )}
                        </div>
                        {/* Day label */}
                        <span style={{ 
                          fontSize: '12px', 
                          color: '#8d6e63', 
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          {dayLabels[index]}
                        </span>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Side widgets */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="card">
                <h3>Operational Queue</h3>
                <ul style={{ listStyle: 'none', padding: 0, marginTop: 10, fontSize: 13 }}>
                  <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span>Pending housekeeping</span>
                    <span className="badge badge-warning">{stats.pendingHousekeeping || 0}</span>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span>Pending maintenance</span>
                    <span className="badge badge-danger">{stats.pendingMaintenance || 0}</span>
                  </li>
                </ul>
              </div>

              <div className="card">
                <h3>Quick Links</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
                  <a href="/reservations" className="btn btn-primary">Create reservation</a>
                  <a href="/rooms" className="btn btn-primary">Assign room</a>
                  <a href="/billing" className="btn btn-primary">Generate invoice</a>
                </div>
              </div>
            </div>
          </div>

          {/* Additional analytics widgets */}
          <div className="grid grid-2 mt-3">
            <div className="card">
              <h3>Revenue Breakdown</h3>
              <p style={{ fontSize: '12px', color: '#8d6e63', marginBottom: '12px' }}>Sample split by channel</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Online', value: 60, color: '#ffcc80' },
                  { label: 'Walk-in', value: 25, color: '#c7925b' },
                  { label: 'Corporate', value: 15, color: '#8d6e63' },
                ].map((row) => (
                  <div key={row.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: 4 }}>
                      <span>{row.label}</span>
                      <span>{row.value}%</span>
                    </div>
                    <div style={{ height: 8, borderRadius: 999, background: '#f3e5dc', overflow: 'hidden' }}>
                      <div style={{ width: `${row.value}%`, height: '100%', background: row.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3>Room Status Snapshot</h3>
              <p style={{ fontSize: '12px', color: '#8d6e63', marginBottom: '12px' }}>Occupancy vs availability</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                <div
                  style={{
                    position: 'relative',
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: `conic-gradient(#ffcc80 0deg, #ffcc80 ${Math.min(occupancyPercent, 100) * 3.6}deg, #f3e5dc ${Math.min(occupancyPercent, 100) * 3.6}deg)`,
                    boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 76,
                      height: 76,
                      borderRadius: '50%',
                      background: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                    }}
                  >
                    <span style={{ fontSize: 20, fontWeight: 700, color: '#6d4c41' }}>{occupancyPercent || 0}%</span>
                    <span style={{ fontSize: 10, color: '#8d6e63' }}>Occupied</span>
                  </div>
                </div>
                <div style={{ fontSize: 13, color: '#5d4037' }}>
                  <div style={{ marginBottom: 6 }}>
                    <strong>{occupiedRooms}</strong> occupied rooms
                  </div>
                  <div style={{ marginBottom: 6 }}>
                    <strong>{availableRooms}</strong> available rooms
                  </div>
                  <div>
                    <strong>{totalRooms}</strong> total rooms
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
