import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { InterviewProvider } from './context/InterviewContext';
import { XPProvider } from './context/XPContext';

// Import the StackNavigator
import StackNavigator from './navigation/StackNavigator';

export default function App() {
  return (
    <AuthProvider>
      <XPProvider>
        <InterviewProvider>
          <NavigationContainer>
            <StatusBar style="light" />
            <StackNavigator />
          </NavigationContainer>
        </InterviewProvider>
      </XPProvider>
    </AuthProvider>
  );
}