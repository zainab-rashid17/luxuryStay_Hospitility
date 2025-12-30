import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Gallery.css';
import './GuestDashboard.css';
import GuestFooter from '../../components/GuestFooter.jsx';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get('/api/gallery');
      const fetchedImages = response.data.images || [];
      
      // If no images, add sample images for demo
      if (fetchedImages.length === 0) {
        const sampleImages = [
          {
            _id: 'sample1',
            title: 'Luxury Suite',
            description: 'Spacious and elegant suite with modern amenities and stunning city views',
            imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
            category: 'rooms'
          },
          {
            _id: 'sample2',
            title: 'Presidential Suite',
            description: 'Ultra-luxurious presidential suite with private balcony and premium amenities',
            imageUrl: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
            category: 'rooms'
          },
          {
            _id: 'sample3',
            title: 'Swimming Pool',
            description: 'Beautiful infinity pool with panoramic views and poolside bar',
            imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
            category: 'amenities'
          },
          {
            _id: 'sample4',
            title: 'Fine Dining Restaurant',
            description: 'Elegant restaurant offering exquisite cuisine and fine wines',
            imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
            category: 'dining'
          },
          {
            _id: 'sample5',
            title: 'Spa & Wellness Center',
            description: 'Relaxing spa facilities with professional massage and treatment rooms',
            imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800',
            category: 'amenities'
          },
          {
            _id: 'sample6',
            title: 'Wedding Venue',
            description: 'Grand ballroom perfect for weddings and special celebrations',
            imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
            category: 'events'
          },
          {
            _id: 'sample7',
            title: 'Hotel Lobby',
            description: 'Grand entrance with elegant furnishings and welcoming atmosphere',
            imageUrl: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
            category: 'general'
          },
          {
            _id: 'sample8',
            title: 'Rooftop Bar',
            description: 'Stylish rooftop bar with signature cocktails and city skyline views',
            imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800',
            category: 'dining'
          }
        ];
        setImages(sampleImages);
      } else {
        setImages(fetchedImages);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      // Add sample images even on error for demo
      const sampleImages = [
        {
          _id: 'sample1',
          title: 'Luxury Suite',
          description: 'Spacious and elegant suite with modern amenities',
          imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
          category: 'rooms'
        },
        {
          _id: 'sample2',
          title: 'Swimming Pool',
          description: 'Beautiful infinity pool with panoramic views',
          imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
          category: 'amenities'
        }
      ];
      setImages(sampleImages);
      setLoading(false);
    }
  };

  const categories = ['all', 'rooms', 'amenities', 'dining', 'events', 'general'];
  const categoryLabels = {
    all: 'All',
    rooms: 'Rooms',
    amenities: 'Amenities',
    dining: 'Dining',
    events: 'Events',
    general: 'General'
  };
  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter(img => img.category === selectedCategory);

  if (loading) {
    return (
      <div className="gallery-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="guest-page-container">
      <div className="gallery-container">
        <div className="gallery-header">
        <div className="gallery-banner-overlay"></div>
        <div className="gallery-header-content">
          <h1 className="page-title section-title-center" style={{ color: '#ffffff', textShadow: '0 4px 12px rgba(0, 0, 0, 0.8)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#d4af37', filter: 'drop-shadow(0 2px 8px rgba(212, 175, 55, 0.6))' }}>
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span>Our Gallery</span>
          </h1>
          <p className="gallery-subtitle">Experience LuxuryStay Through Our Lens</p>
        </div>
      </div>

      <div className="gallery-filters">
        {categories.map(category => (
          <button
            key={category}
            className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {categoryLabels[category]}
          </button>
        ))}
      </div>

      <div className="gallery-grid">
        {filteredImages.length > 0 ? (
          filteredImages.map((image, index) => (
            <div
              key={image._id}
              className="gallery-item"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedImage(image)}
            >
              <div className="gallery-image-wrapper">
                <img
                  src={image.imageUrl}
                  alt={image.title}
                  className="gallery-image"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/800x600/f0f0f0/999999?text=Image+Not+Available';
                  }}
                  onLoad={(e) => {
                    e.target.style.opacity = '1';
                  }}
                  style={{ opacity: 0, transition: 'opacity 0.3s ease' }}
                />
                <div className="gallery-overlay">
                  <h3 className="gallery-item-title">{image.title}</h3>
                  {image.description && (
                    <p className="gallery-item-description">{image.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="gallery-empty">
            <p>No images found in this category</p>
          </div>
        )}
      </div>

      {selectedImage && (
        <div className="gallery-modal" onClick={() => setSelectedImage(null)}>
          <div className="gallery-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="gallery-modal-close" onClick={() => setSelectedImage(null)}>
              ×
            </button>
            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.title}
              className="gallery-modal-image"
            />
            <div className="gallery-modal-info">
              <h2 className="section-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <span>{selectedImage.title}</span>
              </h2>
              {selectedImage.description && <p>{selectedImage.description}</p>}
            </div>
          </div>
        </div>
      )}
      </div>
      <GuestFooter />
    </div>
  );
};

export default Gallery;

