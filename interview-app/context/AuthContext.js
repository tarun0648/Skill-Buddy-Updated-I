// context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from '../services/apiService';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [guestXP, setGuestXP] = useState(0); // Track XP for guest users

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      const storedUser = await AsyncStorage.getItem('user');
      const storedGuestXP = await AsyncStorage.getItem('guestXP');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        apiService.setAuthToken(storedToken);
      }
      
      if (storedGuestXP) {
        setGuestXP(parseInt(storedGuestXP));
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await apiService.login(email, password);
      
      // Create session token
      const sessionToken = `session_${email}_${Date.now()}`;
      
      // Use the complete user data from backend response
      const userData = response.user_data || {
        user_id: response.user_id,
        email: email,
        uid: response.user_id,
        xp_points: 50,
        level: 1,
        github_profile: '',
        linkedin_profile: '',
        resume_uploaded: false,
        total_interviews: 0,
        completed_interviews: 0
      };

      // Store the session
      await AsyncStorage.setItem('authToken', sessionToken);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      
      setToken(sessionToken);
      setUser(userData);
      apiService.setAuthToken(sessionToken);
      
      // Clear guest XP after successful login
      await AsyncStorage.removeItem('guestXP');
      setGuestXP(0);
      
      return userData;
      
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const { email, password, firstName, lastName } = userData;
      
      // Include guest XP when registering
      const response = await apiService.register(email, password, firstName, lastName, guestXP);
      
      // Clear guest XP after successful registration
      await AsyncStorage.removeItem('guestXP');
      setGuestXP(0);
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const addGuestXP = async (amount) => {
    try {
      const newGuestXP = guestXP + amount;
      setGuestXP(newGuestXP);
      await AsyncStorage.setItem('guestXP', newGuestXP.toString());
      return newGuestXP;
    } catch (error) {
      console.error('Error adding guest XP:', error);
      return guestXP;
    }
  };

  const updateUserProfile = async (updatedData) => {
    try {
      if (!user) return null;
      
      const newUserData = { ...user, ...updatedData };
      
      // Update local state
      setUser(newUserData);
      await AsyncStorage.setItem('user', JSON.stringify(newUserData));
      
      return newUserData;
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Clear local storage
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      
      setToken(null);
      setUser(null);
      apiService.setAuthToken(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    token,
    isLoading,
    guestXP,
    login,
    register,
    logout,
    addGuestXP,
    updateUserProfile,
    isAuthenticated: !!user,
    isGuest: !user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};