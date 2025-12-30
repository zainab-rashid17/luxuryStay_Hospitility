import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      
      if (!response.data.success) {
        return {
          success: false,
          message: response.data.message || 'Login failed'
        };
      }
      
      const { token: newToken, user: userData } = response.data;
      
      if (!newToken || !userData) {
        console.error('Login response missing token or user:', response.data);
        return {
          success: false,
          message: 'Invalid login response'
        };
      }
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      return {
        success: false,
        message: errorMessage
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      const { token: newToken, user: userInfo } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userInfo);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return { success: true };
    } catch (error) {
      let errorMessage = 'Registration failed';
      
      if (error.response?.data) {
        // Handle validation errors
        if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
          const validationErrors = error.response.data.errors.map(err => {
            if (err.param === 'email') {
              return 'Invalid email format. Please use format: example@gmail.com';
            }
            if (err.param === 'password') {
              return 'Password must be at least 6 characters long';
            }
            if (err.param === 'role') {
              return 'Invalid role selected';
            }
            return err.msg || `${err.param}: ${err.msg}`;
          });
          errorMessage = validationErrors.join(', ');
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        message: errorMessage
      };
    }
  };

  const googleLogin = async (tokenId) => {
    try {
      const response = await axios.post('/api/auth/google', { tokenId });
      
      if (!response.data.success) {
        return {
          success: false,
          message: response.data.message || 'Google login failed'
        };
      }
      
      const { token: newToken, user: userData } = response.data;
      
      if (!newToken || !userData) {
        return {
          success: false,
          message: 'Invalid Google login response'
        };
      }
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return { success: true };
    } catch (error) {
      console.error('Google login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Google login failed';
      return {
        success: false,
        message: errorMessage
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};


