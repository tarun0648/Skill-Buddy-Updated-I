// screens/LoginScreen.js
import React, { useState, useRef, useEffect } from 'react';
import { TextInput, TouchableOpacity, Text, Alert, ActivityIndicator, View, Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS, gradientButtonStyle, gradientButtonInner } from '../styles';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const { login } = useAuth();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for the login button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await login(email, password);
      console.log('Login successful:', response);
      
      Alert.alert('Success', 'Login successful!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Home')
        }
      ]);
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Unable to login. Please try again.';
      
      if (error.message.includes('User not found')) {
        errorMessage = 'User not found. Please register first or check your email.';
      } else if (error.message.includes('Cannot connect to server')) {
        errorMessage = 'Cannot connect to server. Please check your internet connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Forgot Password',
      'Please contact support or try registering again with the same email.',
      [{ text: 'OK' }]
    );
  };

  const navigateToSignup = () => {
    navigation.navigate('Signup');
  };

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={['#0A0A0A', '#1A1A1A', '#0A0A0A']} 
        style={styles.backgroundGradient}
      />
      
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue your journey</Text>
          <View style={styles.decorativeLine} />
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={[
              styles.inputWrapper,
              emailFocused && styles.inputWrapperFocused,
              email && !isValidEmail(email) && styles.inputWrapperError
            ]}>
              <Text style={styles.inputIcon}>📧</Text>
              <TextInput
                placeholder="Enter your email"
                placeholderTextColor={COLORS.gray}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                style={styles.textInput}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={[
              styles.inputWrapper,
              passwordFocused && styles.inputWrapperFocused
            ]}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor={COLORS.gray}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                style={styles.textInput}
              />
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity 
            onPress={handleForgotPassword}
            style={styles.forgotPasswordContainer}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <LinearGradient
            colors={['#FF6B35', '#FF4757']}
            style={[gradientButtonStyle, styles.loginButton, { opacity: isLoading ? 0.7 : 1 }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <TouchableOpacity 
              style={gradientButtonInner}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={COLORS.white} />
                  <Text style={styles.loadingText}>Signing in...</Text>
                </View>
              ) : (
                <Text style={styles.loginButtonText}>🚀 Sign In</Text>
              )}
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        {/* Sign Up Link */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account?</Text>
          <TouchableOpacity onPress={navigateToSignup}>
            <Text style={styles.signupLink}>Sign up</Text>
          </TouchableOpacity>
        </View>

        {/* Debug Info */}
        {__DEV__ && (
          <View style={styles.debugContainer}>
            <Text style={styles.debugText}>
              Debug: Make sure you've registered with this email first!
            </Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    color: COLORS.white,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.lightGray,
    opacity: 0.8,
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  decorativeLine: {
    width: 60,
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  formContainer: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.darkGray,
    paddingHorizontal: 16,
    ...SHADOWS.small,
  },
  inputWrapperFocused: {
    borderColor: COLORS.primary,
    ...SHADOWS.medium,
  },
  inputWrapperError: {
    borderColor: COLORS.error,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    color: COLORS.white,
    fontSize: 16,
    paddingVertical: 16,
    fontWeight: '400',
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  loginButton: {
    marginBottom: 30,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 16,
    color: COLORS.lightGray,
    marginRight: 8,
  },
  signupLink: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  debugContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  debugText: {
    color: COLORS.white,
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.8,
  },
});