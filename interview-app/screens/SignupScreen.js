// screens/SignupScreen.js
import React, { useState, useRef, useEffect } from 'react';
import { 
  TextInput, 
  TouchableOpacity, 
  Text, 
  Alert, 
  ActivityIndicator, 
  View, 
  ScrollView, 
  Animated, 
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS, gradientButtonStyle, gradientButtonInner } from '../styles';
import { useAuth } from '../context/AuthContext';

export default function SignupScreen({ navigation }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const { register, guestXP } = useAuth();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

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
  }, []);

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSignup = async () => {
    const { firstName, lastName, email, password, confirmPassword } = formData;
    
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const response = await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        password: password
      });
      
      console.log('Signup successful:', response);
      
      let successMessage = 'Account created successfully! Please login to continue.';
      if (guestXP > 0) {
        successMessage += ` Your ${guestXP} XP has been added to your account!`;
      }
      
      Alert.alert(
        'Success', 
        successMessage,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
    } catch (error) {
      console.error('Signup error:', error);
      
      let errorMessage = 'Unable to create account. Please try again.';
      
      if (error.message.includes('User already exists')) {
        errorMessage = 'An account with this email already exists. Please login instead.';
      } else if (error.message.includes('Cannot connect to server')) {
        errorMessage = 'Cannot connect to server. Please check your internet connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Signup Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const getInputBorderColor = (field, value) => {
    if (focusedField === field) return COLORS.primary;
    if (field === 'email' && value && !isValidEmail(value)) return COLORS.error;
    if (field === 'password' && value && value.length < 6) return COLORS.error;
    if (field === 'confirmPassword' && value && formData.password !== value) return COLORS.error;
    return COLORS.darkGray;
  };

  const FormInput = ({ 
    label, 
    placeholder, 
    value, 
    field, 
    icon, 
    secureTextEntry = false, 
    keyboardType = 'default',
    autoCapitalize = 'words'
  }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[
        styles.inputWrapper,
        { borderColor: getInputBorderColor(field, value) }
      ]}>
        <Text style={styles.inputIcon}>{icon}</Text>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray}
          value={value}
          onChangeText={(text) => updateField(field, text)}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={secureTextEntry ? 'none' : autoCapitalize}
          autoCorrect={false}
          onFocus={() => setFocusedField(field)}
          onBlur={() => setFocusedField(null)}
          style={styles.textInput}
          returnKeyType="next"
          blurOnSubmit={false}
        />
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient 
        colors={['#0A0A0A', '#1A1A1A', '#0A0A0A']} 
        style={styles.backgroundGradient}
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join the Skillbuddy community</Text>
            {guestXP > 0 && (
              <View style={styles.bonusContainer}>
                <Text style={styles.bonusText}>🎉 You'll keep your {guestXP} XP!</Text>
              </View>
            )}
            <View style={styles.decorativeLine} />
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <FormInput
              label="First Name"
              placeholder="Enter your first name"
              value={formData.firstName}
              field="firstName"
              icon="👤"
            />

            <FormInput
              label="Last Name"
              placeholder="Enter your last name"
              value={formData.lastName}
              field="lastName"
              icon="👤"
            />

            <FormInput
              label="Email Address"
              placeholder="Enter your email"
              value={formData.email}
              field="email"
              icon="📧"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <FormInput
              label="Password"
              placeholder="Create a password (min 6 characters)"
              value={formData.password}
              field="password"
              icon="🔒"
              secureTextEntry={true}
            />

            <FormInput
              label="Confirm Password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              field="confirmPassword"
              icon="🔐"
              secureTextEntry={true}
            />
          </View>

          {/* Password Strength Indicator */}
          {formData.password.length > 0 && (
            <View style={styles.passwordStrengthContainer}>
              <Text style={styles.passwordStrengthLabel}>Password Strength:</Text>
              <View style={styles.passwordStrengthBar}>
                <View style={[
                  styles.passwordStrengthFill,
                  {
                    width: `${Math.min((formData.password.length / 8) * 100, 100)}%`,
                    backgroundColor: formData.password.length < 6 ? COLORS.error : formData.password.length < 8 ? COLORS.warning : COLORS.success
                  }
                ]} />
              </View>
              <Text style={[
                styles.passwordStrengthText,
                { color: formData.password.length < 6 ? COLORS.error : formData.password.length < 8 ? COLORS.warning : COLORS.success }
              ]}>
                {formData.password.length < 6 ? 'Weak' : formData.password.length < 8 ? 'Good' : 'Strong'}
              </Text>
            </View>
          )}

          {/* Create Account Button */}
          <LinearGradient
            colors={['#FF6B35', '#FF4757']}
            style={[gradientButtonStyle, styles.signupButton, { opacity: isLoading ? 0.7 : 1 }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <TouchableOpacity 
              style={gradientButtonInner}
              onPress={handleSignup}
              disabled={isLoading}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={COLORS.white} />
                  <Text style={styles.loadingText}>Creating Account...</Text>
                </View>
              ) : (
                <Text style={styles.signupButtonText}>✨ Create Account</Text>
              )}
            </TouchableOpacity>
          </LinearGradient>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>

          {/* Terms and Privacy */}
          <Text style={styles.termsText}>
            By creating an account, you agree to our{'\n'}
            <Text style={styles.termsLink}>Terms of Service</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
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
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  bonusContainer: {
    backgroundColor: 'rgba(0, 255, 135, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 135, 0.3)',
    marginBottom: 12,
  },
  bonusText: {
    fontSize: 14,
    color: COLORS.success,
    fontWeight: '600',
    textAlign: 'center',
  },
  decorativeLine: {
    width: 60,
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  formContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
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
    paddingHorizontal: 16,
    ...SHADOWS.small,
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
  passwordStrengthContainer: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  passwordStrengthLabel: {
    fontSize: 12,
    color: COLORS.lightGray,
    marginBottom: 6,
    fontWeight: '500',
  },
  passwordStrengthBar: {
    height: 4,
    backgroundColor: COLORS.darkGray,
    borderRadius: 2,
    marginBottom: 4,
    overflow: 'hidden',
  },
  passwordStrengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  passwordStrengthText: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'right',
  },
  signupButton: {
    marginBottom: 30,
  },
  signupButtonText: {
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  loginText: {
    fontSize: 16,
    color: COLORS.lightGray,
    marginRight: 8,
  },
  loginLink: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  termsText: {
    fontSize: 12,
    color: COLORS.lightGray,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 18,
  },
  termsLink: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
});