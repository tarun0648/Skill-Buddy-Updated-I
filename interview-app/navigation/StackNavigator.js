// navigation/StackNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import all screens with default imports
import IntroScreen from '../screens/IntroScreen';
import AboutScreen from '../screens/AboutScreen';
import IntroQuestionScreen from '../screens/IntroQuestionScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ProfileScreen from '../screens/ProfileScreen';
import InterviewScreen from '../screens/InterviewScreen';
import InterviewResultsScreen from '../screens/InterviewResultsScreen';
import DataAnalystScreen from '../screens/DataAnalystScreen';
import DigitalMarketerScreen from '../screens/DigitalMarketerScreen';
import SoftwareDevScreen from '../screens/SoftwareDevScreen';
import UIDesignerScreen from '../screens/UIDesignerScreen';

const Stack = createStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="Intro"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#0A0A0A' },
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
      }}
    >
      {/* Onboarding Flow */}
      <Stack.Screen 
        name="Intro" 
        component={IntroScreen}
        options={{
          animationTypeForReplace: 'push',
        }}
      />
      
      <Stack.Screen 
        name="About" 
        component={AboutScreen}
        options={{
          gestureDirection: 'horizontal',
        }}
      />
      
      <Stack.Screen 
        name="Questions" 
        component={IntroQuestionScreen}
        options={{
          gestureDirection: 'horizontal',
        }}
      />
      
      {/* Main App */}
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          gestureDirection: 'horizontal',
          animationEnabled: true,
        }}
      />

      {/* Authentication Screens */}
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{
          gestureDirection: 'horizontal',
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateY: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.height, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      />
      
      <Stack.Screen 
        name="Signup" 
        component={SignupScreen}
        options={{
          gestureDirection: 'horizontal',
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateY: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.height, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      />

      {/* Interview Flow */}
      <Stack.Screen 
        name="Interview" 
        component={InterviewScreen}
        options={{
          gestureDirection: 'horizontal',
        }}
      />
      
      <Stack.Screen 
        name="InterviewResults" 
        component={InterviewResultsScreen}
        options={{
          gestureDirection: 'horizontal',
          gestureEnabled: false, // Prevent going back from results
        }}
      />

      {/* Profile */}
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          gestureDirection: 'horizontal',
        }}
      />

      {/* Career-specific Interview Screens */}
      <Stack.Screen 
        name="DataAnalyst" 
        component={DataAnalystScreen}
        options={{
          gestureDirection: 'horizontal',
        }}
      />
      
      <Stack.Screen 
        name="DigitalMarketer" 
        component={DigitalMarketerScreen}
        options={{
          gestureDirection: 'horizontal',
        }}
      />
      
      <Stack.Screen 
        name="SoftwareDev" 
        component={SoftwareDevScreen}
        options={{
          gestureDirection: 'horizontal',
        }}
      />
      
      <Stack.Screen 
        name="UIDesigner" 
        component={UIDesignerScreen}
        options={{
          gestureDirection: 'horizontal',
        }}
      />
    </Stack.Navigator>
  );
}