import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout.jsx';
import './Gallery.css';

const GalleryAdmin = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    category: 'general',
    image: null
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get('/api/gallery');
      setImages(response.data.images || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setUploadData({ ...uploadData, image: e.target.files[0] });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadData.image) {
      alert('Please select an image');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', uploadData.image);
      formData.append('title', uploadData.title);
      formData.append('description', uploadData.description);
      formData.append('category', uploadData.category);

      await axios.post('/api/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setShowUploadForm(false);
      setUploadData({ title: '', description: '', category: 'general', image: null });
      document.querySelector('input[type="file"]').value = '';
      fetchImages();
      alert('Image uploaded successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      await axios.delete(`/api/gallery/${id}`);
      fetchImages();
      alert('Image deleted successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting image');
    }
  };

  return (
    <AdminLayout title="Gallery" subtitle="Upload and manage visual assets for LuxuryStay">
      <div className="gallery-admin-container">
        <div className="gallery-admin-header">
        <h1>Gallery Management</h1>
        <button className="btn btn-primary" onClick={() => setShowUploadForm(!showUploadForm)}>
          {showUploadForm ? 'Cancel' : 'Upload Image'}
        </button>
      </div>

      {showUploadForm && (
        <div className="gallery-upload-card">
          <h2>Upload New Image</h2>
          <form onSubmit={handleUpload}>
            <div className="form-group">
              <label>Image</label>
              <input type="file" accept="image/*" onChange={handleFileChange} required />
              {uploadData.image && (
                <img 
                  src={URL.createObjectURL(uploadData.image)} 
                  alt="Preview" 
                  className="image-preview"
                />
              )}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={uploadData.category}
                  onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                  required
                >
                  <option value="general">General</option>
                  <option value="rooms">Rooms</option>
                  <option value="amenities">Amenities</option>
                  <option value="dining">Dining</option>
                  <option value="events">Events</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={uploadData.description}
                onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                rows="3"
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
          </form>
        </div>
      )}

      <div className="gallery-admin-grid">
        {images.map((image) => (
          <div key={image._id} className="gallery-admin-item">
            <img src={image.imageUrl} alt={image.title} />
            <div className="gallery-admin-info">
              <h3>{image.title}</h3>
              <p>{image.description}</p>
              <span className="gallery-category">{image.category}</span>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(image._id)}
                style={{ marginTop: '10px' }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </AdminLayout>
  );
};

export default GalleryAdmin;

