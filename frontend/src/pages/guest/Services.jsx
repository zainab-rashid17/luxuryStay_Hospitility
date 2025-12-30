import React from 'react';
import GuestFooter from '../../components/GuestFooter.jsx';

const Services = () => {
  const coreServices = [
    {
      title: 'Room Service',
      icon: '🍽️',
      description: '24/7 in-room dining with curated multi-cuisine menus, midnight snacks, and signature beverages served directly to your suite.'
    },
    {
      title: 'Spa & Wellness',
      icon: '✨',
      description: 'Luxury spa therapies, massages, facials, and rejuvenation rituals designed to relax your mind and body.'
    },
    {
      title: 'Fine Dining',
      icon: '🥂',
      description: 'Gourmet restaurants and private dining experiences with chef’s specials, wine pairings, and themed evenings.'
    },
    {
      title: 'Concierge Services',
      icon: '🎩',
      description: 'Personalized assistance for city tours, restaurant bookings, event tickets, and any special arrangements you need.'
    },
    {
      title: 'Airport Transfers',
      icon: '🚘',
      description: 'Chauffeur-driven luxury cars for airport pick-up & drop, business meetings, and local travel.'
    },
    {
      title: 'Laundry & Dry Cleaning',
      icon: '🧺',
      description: 'Express laundry, dry cleaning, and pressing services to keep you ready for every occasion.'
    },
    {
      title: 'Business Services',
      icon: '💼',
      description: 'High-speed Wi‑Fi, meeting rooms, printing & scanning, and a dedicated business support team.'
    },
    {
      title: 'Events & Celebrations',
      icon: '🎉',
      description: 'Beautifully curated spaces and planners for birthdays, anniversaries, corporate events, and intimate gatherings.'
    }
  ];

  const howToRequest = [
    'Call the front-desk or concierge from your in-room phone.',
    'Inform our team at the reception while you are on the property.',
    'Mention your preferences while making a reservation or during check-in.'
  ];

  return (
    <div className="guest-page-container">
      <div className="page-header">
        <div className="page-header-content">
          <div className="page-title-section">
            <div className="page-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"></path>
              </svg>
            </div>
            <div>
              <h1 className="page-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <span>LuxuryStay Services</span>
              </h1>
              <p className="page-subtitle">
                Discover all the premium services we offer to make your stay truly unforgettable.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Services Grid */}
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h2 className="section-title section-title-center">
          <span>Signature Guest Services</span>
        </h2>
        <p style={{ textAlign: 'center', color: '#6b7280', maxWidth: '720px', margin: '0 auto 2rem' }}>
          Every service at LuxuryStay is crafted to give you a seamless, luxurious, and memorable experience –
          whether you are here for business, leisure, or celebration.
        </p>

        <div className="features-grid services-grid">
          {coreServices.map((service, index) => (
            <div key={service.title} className="feature-card services-card" style={{ animationDelay: `${index * 80}ms` }}>
              <div className="feature-icon">
                <span style={{ fontSize: '1.8rem' }}>{service.icon}</span>
              </div>
              <h3 className="feature-title">{service.title}</h3>
              <p className="feature-description">{service.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How to request section */}
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h2 className="section-title">
          <span>How to Request a Service</span>
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
          Our team is available round-the-clock to assist you. You don&apos;t need to fill any online form –
          simply choose the option most convenient for you:
        </p>
        <ol style={{ paddingLeft: '1.25rem', color: '#4b5563', lineHeight: 1.7 }}>
          {howToRequest.map((step, idx) => (
            <li key={idx} style={{ marginBottom: '0.5rem' }}>{step}</li>
          ))}
        </ol>
        <p style={{ marginTop: '1.5rem', color: '#8b6f47', fontWeight: 600 }}>
          Our promise: warm smiles, quick responses, and attention to every detail of your stay.
        </p>
      </div>

      {/* Small highlight strip */}
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h2 className="section-title section-title-center">
          <span>Tailored Experiences</span>
        </h2>
        <p style={{ textAlign: 'center', color: '#6b7280', maxWidth: '680px', margin: '0 auto 1.5rem' }}>
          Celebrating something special or have a unique request? Our team loves creating custom experiences –
          from romantic room setups to curated city experiences.
        </p>
        <p style={{ textAlign: 'center', color: '#8b6f47', fontWeight: 600 }}>
          Speak to our concierge during your stay and we&apos;ll handle the rest.
        </p>
      </div>
      <GuestFooter />
    </div>
  );
};

export default Services;
