import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext.jsx';
import AdminLayout from '../../components/AdminLayout.jsx';

const Rooms = () => {
  const { user } = useContext(AuthContext);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    roomNumber: '',
    roomType: 'Single',
    floor: 1,
    pricePerNight: 0,
    maxOccupancy: 1,
    amenities: [],
    description: ''
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [filter, setFilter] = useState({ status: '', roomType: '' });

  useEffect(() => {
    fetchRooms();
  }, [filter]);

  const fetchRooms = async () => {
    try {
      const params = {};
      if (filter.status) params.status = filter.status;
      if (filter.roomType) params.roomType = filter.roomType;
      
      const response = await axios.get('/api/rooms', { params });
      setRooms(response.data.rooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert('You can only upload up to 5 images');
      return;
    }
    
    setSelectedImages(files);
    
    // Create previews
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleEdit = (room) => {
    setEditingRoom(room._id);
    setFormData({
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      floor: room.floor,
      pricePerNight: room.pricePerNight,
      maxOccupancy: room.maxOccupancy,
      amenities: room.amenities || [],
      description: room.description || ''
    });
    setImagePreviews(room.images || []);
    setSelectedImages([]);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'amenities' && Array.isArray(formData[key])) {
          formData[key].forEach(amenity => submitData.append('amenities[]', amenity));
        } else {
          submitData.append(key, formData[key]);
        }
      });
      
      // Append images
      selectedImages.forEach((image, index) => {
        submitData.append('images', image);
      });

      if (editingRoom) {
        // Update existing room
        await axios.put(`/api/rooms/${editingRoom}`, submitData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // Create new room
        await axios.post('/api/rooms', submitData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      setShowForm(false);
      setEditingRoom(null);
      setFormData({
        roomNumber: '',
        roomType: 'Single',
        floor: 1,
        pricePerNight: 0,
        maxOccupancy: 1,
        amenities: [],
        description: ''
      });
      setSelectedImages([]);
      setImagePreviews([]);
      fetchRooms();
    } catch (error) {
      alert(error.response?.data?.message || `Error ${editingRoom ? 'updating' : 'creating'} room`);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.put(`/api/rooms/${id}`, { status: newStatus });
      fetchRooms();
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating room status');
    }
  };

  return (
    <AdminLayout title="Rooms" subtitle="Configure room types, pricing and availability">
      <div className="page-header" style={{ marginBottom: '20px' }}>
        <h2>Room Management</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => {
              if (showForm && editingRoom) {
                // Cancel edit mode
                setShowForm(false);
                setEditingRoom(null);
                setFormData({
                  roomNumber: '',
                  roomType: 'Single',
                  floor: 1,
                  pricePerNight: 0,
                  maxOccupancy: 1,
                  amenities: [],
                  description: ''
                });
                setSelectedImages([]);
                setImagePreviews([]);
              }
            }}
            style={{ display: showForm && editingRoom ? 'block' : 'none' }}
          >
            Cancel Edit
          </button>
          <button 
            className="btn btn-primary" 
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) {
                // Reset form when canceling
                setEditingRoom(null);
                setFormData({
                  roomNumber: '',
                  roomType: 'Single',
                  floor: 1,
                  pricePerNight: 0,
                  maxOccupancy: 1,
                  amenities: [],
                  description: ''
                });
                setSelectedImages([]);
                setImagePreviews([]);
              }
            }}
          >
            {showForm ? 'Cancel' : 'Add Room'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card">
          <h2>{editingRoom ? 'Edit Room' : 'Create New Room'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Room Number</label>
                <input
                  type="text"
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Room Type</label>
                <select
                  value={formData.roomType}
                  onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                  required
                >
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Suite">Suite</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Presidential">Presidential</option>
                </select>
              </div>
              <div className="form-group">
                <label>Floor</label>
                <input
                  type="number"
                  value={formData.floor}
                  onChange={(e) => setFormData({ ...formData, floor: parseInt(e.target.value) })}
                  required
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Price Per Night ($)</label>
                <input
                  type="number"
                  value={formData.pricePerNight}
                  onChange={(e) => setFormData({ ...formData, pricePerNight: parseFloat(e.target.value) })}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label>Max Occupancy</label>
                <input
                  type="number"
                  value={formData.maxOccupancy}
                  onChange={(e) => setFormData({ ...formData, maxOccupancy: parseInt(e.target.value) })}
                  required
                  min="1"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Room Images (Max 5 images)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                style={{ 
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  width: '100%'
                }}
              />
              {imagePreviews.length > 0 && (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', 
                  gap: '10px', 
                  marginTop: '15px' 
                }}>
                  {imagePreviews.map((preview, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                      <img 
                        src={preview} 
                        alt={`Preview ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          border: '1px solid #ddd'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        style={{
                          position: 'absolute',
                          top: '5px',
                          right: '5px',
                          background: 'red',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button type="submit" className="btn btn-primary">
              {editingRoom ? 'Update Room' : 'Create Room'}
            </button>
          </form>
        </div>
      )}

      <div className="card">
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            style={{ padding: '8px' }}
          >
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="cleaning">Cleaning</option>
            <option value="maintenance">Maintenance</option>
            <option value="reserved">Reserved</option>
          </select>
          <select
            value={filter.roomType}
            onChange={(e) => setFilter({ ...filter, roomType: e.target.value })}
            style={{ padding: '8px' }}
          >
            <option value="">All Types</option>
            <option value="Single">Single</option>
            <option value="Double">Double</option>
            <option value="Suite">Suite</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Presidential">Presidential</option>
          </select>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Room Number</th>
              <th>Type</th>
              <th>Floor</th>
              <th>Price/Night</th>
              <th>Max Occupancy</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map(room => (
              <tr key={room._id}>
                <td>
                  {room.images && room.images.length > 0 ? (
                    <img 
                      src={room.images[0]} 
                      alt={room.roomNumber}
                      style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                        border: '1px solid #ddd'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: '#f0f0f0',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#999',
                      fontSize: '12px'
                    }}>
                      No Image
                    </div>
                  )}
                </td>
                <td>{room.roomNumber}</td>
                <td>{room.roomType}</td>
                <td>{room.floor}</td>
                <td>${room.pricePerNight.toFixed(2)}</td>
                <td>{room.maxOccupancy}</td>
                <td>
                  <span className={`badge ${
                    room.status === 'available' ? 'badge-success' :
                    room.status === 'occupied' ? 'badge-danger' :
                    room.status === 'cleaning' ? 'badge-warning' :
                    room.status === 'maintenance' ? 'badge-danger' :
                    'badge-info'
                  }`}>
                    {room.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleEdit(room)}
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                    >
                      Edit
                    </button>
                    <select
                      value={room.status}
                      onChange={(e) => handleStatusUpdate(room._id, e.target.value)}
                      style={{ padding: '5px', fontSize: '12px' }}
                    >
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="cleaning">Cleaning</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="reserved">Reserved</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default Rooms;

