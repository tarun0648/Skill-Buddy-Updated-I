// context/XPContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import apiService from '../services/apiService';

const XPContext = createContext();

export const useXP = () => {
  const context = useContext(XPContext);
  if (!context) {
    throw new Error('useXP must be used within an XPProvider');
  }
  return context;
};

export const XPProvider = ({ children }) => {
  const { user, guestXP, addGuestXP, updateUserProfile } = useAuth();
  const [totalXP, setTotalXP] = useState(50);
  const [level, setLevel] = useState(1);
  const [xpToNextLevel, setXpToNextLevel] = useState(50);
  const [currentLevelXP, setCurrentLevelXP] = useState(0);
  const [recentXPGains, setRecentXPGains] = useState([]);

  // Initialize XP from user data or guest XP
  useEffect(() => {
    if (user) {
      setTotalXP(user.xp_points || 50);
      setLevel(user.level || 1);
    } else {
      // Guest user - use guest XP
      setTotalXP(50 + guestXP);
      calculateLevel(50 + guestXP);
    }
  }, [user, guestXP]);

  // Calculate level based on total XP
  const calculateLevel = (xp) => {
    let currentLevel = 1;
    let xpNeeded = 100;
    let totalXpForLevel = 0;

    while (xp >= totalXpForLevel + xpNeeded) {
      totalXpForLevel += xpNeeded;
      currentLevel++;
      xpNeeded = currentLevel * 100;
    }

    const currentLevelProgress = xp - totalXpForLevel;
    const nextLevelRequirement = xpNeeded;

    setLevel(currentLevel);
    setCurrentLevelXP(currentLevelProgress);
    setXpToNextLevel(nextLevelRequirement - currentLevelProgress);

    return {
      level: currentLevel,
      currentLevelXP: currentLevelProgress,
      xpToNextLevel: nextLevelRequirement - currentLevelProgress,
      nextLevelRequirement
    };
  };

  useEffect(() => {
    calculateLevel(totalXP);
  }, [totalXP]);

  const addXP = async (amount, source = 'Unknown') => {
    try {
      const oldLevel = level;
      const newTotalXP = totalXP + amount;
      
      setTotalXP(newTotalXP);
      
      // Track recent XP gains
      const newGain = {
        id: Date.now(),
        amount,
        source,
        timestamp: new Date().toISOString()
      };
      
      setRecentXPGains(prev => [newGain, ...prev.slice(0, 4)]);
      
      if (user && user.uid) {
        // Authenticated user - add XP via API
        try {
          const response = await apiService.addXP(user.uid, amount, source);
          
          if (response && response.xp_data) {
            const { total_xp, current_level } = response.xp_data;
            
            // Update user profile in auth context
            await updateUserProfile({
              xp_points: total_xp,
              level: current_level
            });
            
            setTotalXP(total_xp);
            setLevel(current_level);
            
            newGain.level_up = current_level > oldLevel;
          }
        } catch (error) {
          console.error('Error adding XP via API:', error);
          // Continue with local update if API fails
        }
      } else {
        // Guest user - store XP locally
        await addGuestXP(amount);
        calculateLevel(newTotalXP);
        
        newGain.level_up = level > oldLevel;
      }
      
      return newGain;
    } catch (error) {
      console.error('Error adding XP:', error);
      return null;
    }
  };

  const getXPRewards = () => {
    return {
      INTERVIEW_COMPLETE: Math.floor(Math.random() * 50) + 50, // 50-100 XP
      PERFECT_INTERVIEW: Math.floor(Math.random() * 100) + 100, // 100-200 XP
      FIRST_INTERVIEW: 150,
      STREAK_BONUS: Math.floor(Math.random() * 30) + 20, // 20-50 XP
      FEEDBACK_GIVEN: 25,
      DAILY_LOGIN: 10,
      ROULETTE_BONUS: Math.floor(Math.random() * 250) + 50 // 50-300 XP
    };
  };

  const getLevelBadge = (userLevel = level) => {
    const badges = {
      1: { name: 'Rookie', icon: '🥉', color: '#CD7F32' },
      2: { name: 'Learner', icon: '📚', color: '#4A90E2' },
      3: { name: 'Practitioner', icon: '💪', color: '#7ED321' },
      4: { name: 'Professional', icon: '🎯', color: '#F5A623' },
      5: { name: 'Expert', icon: '⭐', color: '#BD10E0' },
      6: { name: 'Master', icon: '🏆', color: '#FFD700' },
      7: { name: 'Champion', icon: '👑', color: '#FF6B6B' },
      8: { name: 'Legend', icon: '🔥', color: '#FF4757' },
      9: { name: 'Mythic', icon: '💎', color: '#3742FA' },
      10: { name: 'Godlike', icon: '🌟', color: '#2F3542' }
    };
    
    if (userLevel >= 10) return badges[10];
    return badges[userLevel] || badges[1];
  };

  const getProgressPercentage = () => {
    if (xpToNextLevel === 0) return 100;
    return (currentLevelXP / (currentLevelXP + xpToNextLevel)) * 100;
  };

  const value = {
    totalXP,
    level,
    currentLevelXP,
    xpToNextLevel,
    recentXPGains,
    guestXP,
    addXP,
    getXPRewards,
    getLevelBadge,
    calculateLevel,
    getProgressPercentage,
  };

  return (
    <XPContext.Provider value={value}>
      {children}
    </XPContext.Provider>
  );
};