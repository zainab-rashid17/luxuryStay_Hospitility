import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const GoogleSignIn = ({ text = 'Sign in with Google' }) => {
  const { googleLogin } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    // Load Google Identity Services
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
          callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'signin_with',
            locale: 'en'
          }
        );
      }
    };

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleCredentialResponse = async (response) => {
    setLoading(true);
    const result = await googleLogin(response.credential);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      alert(result.message || 'Google sign in failed');
    }
    
    setLoading(false);
  };

  return (
    <div className="google-signin-container">
      <div id="google-signin-button"></div>
      {loading && (
        <div className="google-loading">
          <span className="spinner-small"></span>
          Signing in...
        </div>
      )}
    </div>
  );
};

export default GoogleSignIn;

