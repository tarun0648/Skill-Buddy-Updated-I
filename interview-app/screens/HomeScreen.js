// screens/HomeScreen.js
import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Alert,
  Animated,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SHADOWS, gradientButtonStyle, gradientButtonInner } from '../styles';
import { useAuth } from '../context/AuthContext';
import { useXP } from '../context/XPContext';
import apiService from '../services/apiService';

const { width } = Dimensions.get('window');

// Make sure to use default export
export default function HomeScreen() {
  const navigation = useNavigation();
  const { user, isAuthenticated, logout } = useAuth();
  const { totalXP, level, getLevelBadge, getProgressPercentage } = useXP();
  
  const [userProfile, setUserProfile] = useState({
    githubProfile: '',
    linkedinProfile: '',
    resumeUploaded: false,
    resumeFileName: ''
  });
  
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

    // Pulse animation for CTA button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
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

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    try {
      if (user && user.uid) {
        const profileData = await apiService.getUserProfile(user.uid);
        if (profileData && profileData.user) {
          setUserProfile({
            githubProfile: profileData.user.github_profile || '',
            linkedinProfile: profileData.user.linkedin_profile || '',
            resumeUploaded: profileData.user.resume_uploaded || false,
            resumeFileName: profileData.user.resume_file_name || ''
          });
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const handleStartInterview = () => {
    navigation.navigate('Questions');
  };

  const handleProfileNavigation = () => {
    if (isAuthenticated) {
      navigation.navigate('Profile');
    } else {
      Alert.alert(
        'Login Required',
        'Please log in to view your profile.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => navigation.navigate('Login') }
        ]
      );
    }
  };

  const handleAddGitHub = async () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Login Required',
        'Please log in to add your GitHub profile.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
    }

    Alert.prompt(
      'Add GitHub Profile',
      'Enter your GitHub username:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Save', 
          onPress: async (username) => {
            if (username && username.trim()) {
              try {
                setUserProfile(prev => ({
                  ...prev,
                  githubProfile: username.trim()
                }));

                await apiService.updateProfile(user.uid, {
                  github_profile: username.trim()
                });

                Alert.alert('Success', 'GitHub profile added successfully!');
              } catch (error) {
                console.error('GitHub update error:', error);
                setUserProfile(prev => ({
                  ...prev,
                  githubProfile: ''
                }));
                Alert.alert('Error', 'Failed to update GitHub profile');
              }
            }
          }
        }
      ],
      'plain-text',
      userProfile.githubProfile
    );
  };

  const handleAddLinkedIn = async () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Login Required',
        'Please log in to add your LinkedIn profile.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
    }

    Alert.prompt(
      'Add LinkedIn Profile',
      'Enter your LinkedIn username or custom URL:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Save', 
          onPress: async (username) => {
            if (username && username.trim()) {
              try {
                let cleanUsername = username.trim()
                  .replace('https://linkedin.com/in/', '')
                  .replace('https://www.linkedin.com/in/', '')
                  .replace('linkedin.com/in/', '')
                  .replace('www.linkedin.com/in/', '')
                  .replace('/in/', '')
                  .replace('/', '');
                
                setUserProfile(prev => ({
                  ...prev,
                  linkedinProfile: cleanUsername
                }));

                await apiService.updateProfile(user.uid, {
                  linkedin_profile: cleanUsername
                });

                Alert.alert('Success', 'LinkedIn profile added successfully!');
              } catch (error) {
                console.error('LinkedIn update error:', error);
                setUserProfile(prev => ({
                  ...prev,
                  linkedinProfile: ''
                }));
                Alert.alert('Error', 'Failed to update LinkedIn profile');
              }
            }
          }
        }
      ],
      'plain-text',
      userProfile.linkedinProfile,
      'Enter username (e.g., john-doe) or paste full LinkedIn URL'
    );
  };

  const handleUploadResume = () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Login Required',
        'Please log in to upload your resume.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
    }

    Alert.alert(
      'Upload Resume',
      'Choose how you want to upload your resume:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Camera', 
          onPress: openCamera
        },
        { 
          text: 'Document Picker', 
          onPress: openDocumentPicker
        }
      ]
    );
  };

  const openCamera = async () => {
    try {
      const simulatedFile = {
        name: 'Resume_Camera.pdf',
        type: 'application/pdf',
        data: 'base64_encoded_file_data_here'
      };
      
      await uploadResumeFile(simulatedFile);
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to capture image');
    }
  };

  const openDocumentPicker = async () => {
    try {
      const simulatedFile = {
        name: 'My_Resume.pdf',
        type: 'application/pdf',
        data: 'base64_encoded_file_data_here'
      };
      
      await uploadResumeFile(simulatedFile);
    } catch (error) {
      console.error('Document picker error:', error);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const uploadResumeFile = async (file) => {
    try {
      if (!user || !user.uid) {
        Alert.alert('Error', 'Please log in to upload files');
        return;
      }

      setUserProfile(prev => ({
        ...prev,
        resumeUploaded: true,
        resumeFileName: file.name
      }));

      const response = await apiService.updateProfile(user.uid, {
        resume_data: file.data,
        resume_filename: file.name
      });

      Alert.alert('Success', 'Resume uploaded successfully!');
      console.log('Resume upload response:', response);
      
    } catch (error) {
      console.error('Resume upload error:', error);
      
      setUserProfile(prev => ({
        ...prev,
        resumeUploaded: false,
        resumeFileName: ''
      }));
      
      Alert.alert('Error', 'Failed to upload resume. Please try again.');
    }
  };

  const levelBadge = getLevelBadge(level);

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={['#0A0A0A', '#1A1A1A', '#0A0A0A']} 
        style={styles.backgroundGradient}
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
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
            <View style={styles.headerTop}>
              <Text style={styles.welcomeText}>
                Welcome back{isAuthenticated && user?.first_name ? `, ${user.first_name}` : ''}!
              </Text>
              <TouchableOpacity 
                style={styles.profileButton}
                onPress={handleProfileNavigation}
              >
                <LinearGradient
                  colors={['#FF6B35', '#FF4757']}
                  style={styles.profileGradient}
                >
                  <Text style={styles.profileButtonText}>
                    {isAuthenticated ? '👤' : '🔐'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            
            {/* XP and Level Display */}
            {isAuthenticated && (
              <View style={styles.xpContainer}>
                <View style={styles.levelBadgeContainer}>
                  <View style={[styles.levelBadge, { backgroundColor: levelBadge.color }]}>
                    <Text style={styles.levelBadgeIcon}>{levelBadge.icon}</Text>
                  </View>
                  <View style={styles.levelInfo}>
                    <Text style={styles.levelText}>Level {level} • {levelBadge.name}</Text>
                    <Text style={styles.xpText}>{totalXP} XP</Text>
                  </View>
                </View>
                
                <View style={styles.xpProgressBar}>
                  <Animated.View 
                    style={[
                      styles.xpProgressFill,
                      {
                        transform: [{
                          scaleX: fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, getProgressPercentage() / 100]
                          })
                        }]
                      }
                    ]} 
                  />
                </View>
              </View>
            )}
          </View>

          {/* Main Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              Skill<Text style={styles.titleAccent}>buddy</Text>
            </Text>
            <Text style={styles.subtitle}>
              Master your interview skills with AI-powered practice
            </Text>
          </View>

          {/* Start Interview CTA */}
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <LinearGradient
              colors={['#FF6B35', '#FF4757']}
              style={[gradientButtonStyle, styles.ctaButton]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <TouchableOpacity 
                style={gradientButtonInner}
                onPress={handleStartInterview}
              >
                <Text style={styles.ctaButtonText}>🚀 Start Practice Interview</Text>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            
            <TouchableOpacity 
              style={[styles.actionCard, userProfile.githubProfile && styles.actionCardCompleted]}
              onPress={handleAddGitHub}
            >
              <Text style={styles.actionIcon}>🐙</Text>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>
                  {userProfile.githubProfile ? 'GitHub Connected' : 'Add GitHub'}
                </Text>
                <Text style={styles.actionDescription}>
                  {userProfile.githubProfile 
                    ? `github.com/${userProfile.githubProfile}` 
                    : 'Connect your coding profile'
                  }
                </Text>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionCard, userProfile.linkedinProfile && styles.actionCardCompleted]}
              onPress={handleAddLinkedIn}
            >
              <Text style={styles.actionIcon}>💼</Text>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>
                  {userProfile.linkedinProfile ? 'LinkedIn Connected' : 'Add LinkedIn'}
                </Text>
                <Text style={styles.actionDescription}>
                  {userProfile.linkedinProfile 
                    ? `linkedin.com/in/${userProfile.linkedinProfile}` 
                    : 'Link your professional profile'
                  }
                </Text>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionCard, userProfile.resumeUploaded && styles.actionCardCompleted]}
              onPress={handleUploadResume}
            >
              <Text style={styles.actionIcon}>📄</Text>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>
                  {userProfile.resumeUploaded ? 'Resume Uploaded' : 'Upload Resume'}
                </Text>
                <Text style={styles.actionDescription}>
                  {userProfile.resumeUploaded 
                    ? userProfile.resumeFileName 
                    : 'Add your CV for personalized tips'
                  }
                </Text>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </TouchableOpacity>
          </View>

          {/* Features Grid */}
          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>Why Skillbuddy?</Text>
            
            <View style={styles.featuresGrid}>
              <View style={styles.featureCard}>
                <LinearGradient
                  colors={['rgba(108, 99, 255, 0.2)', 'rgba(108, 99, 255, 0.1)']}
                  style={styles.featureGradient}
                >
                  <Text style={styles.featureIcon}>🎯</Text>
                  <Text style={styles.featureTitle}>Role-Specific</Text>
                  <Text style={styles.featureDescription}>
                    Tailored questions for your career path
                  </Text>
                </LinearGradient>
              </View>

              <View style={styles.featureCard}>
                <LinearGradient
                  colors={['rgba(0, 255, 135, 0.2)', 'rgba(0, 255, 135, 0.1)']}
                  style={styles.featureGradient}
                >
                  <Text style={styles.featureIcon}>🤖</Text>
                  <Text style={styles.featureTitle}>AI-Powered</Text>
                  <Text style={styles.featureDescription}>
                    Smart feedback and insights
                  </Text>
                </LinearGradient>
              </View>

              <View style={styles.featureCard}>
                <LinearGradient
                  colors={['rgba(255, 215, 0, 0.2)', 'rgba(255, 215, 0, 0.1)']}
                  style={styles.featureGradient}
                >
                  <Text style={styles.featureIcon}>📈</Text>
                  <Text style={styles.featureTitle}>Track Progress</Text>
                  <Text style={styles.featureDescription}>
                    Monitor improvement over time
                  </Text>
                </LinearGradient>
              </View>

              <View style={styles.featureCard}>
                <LinearGradient
                  colors={['rgba(255, 107, 53, 0.2)', 'rgba(255, 107, 53, 0.1)']}
                  style={styles.featureGradient}
                >
                  <Text style={styles.featureIcon}>🏆</Text>
                  <Text style={styles.featureTitle}>Earn Rewards</Text>
                  <Text style={styles.featureDescription}>
                    Level up with XP points
                  </Text>
                </LinearGradient>
              </View>
            </View>
          </View>

          {/* Auth Buttons with Save Progress Message */}
          {!isAuthenticated && (
            <View style={styles.authSection}>
              <View style={styles.saveProgressCard}>
                <Text style={styles.saveProgressIcon}>💾</Text>
                <Text style={styles.saveProgressTitle}>Want to save your progress?</Text>
                <Text style={styles.saveProgressText}>
                  Sign in to keep your XP, achievements, and interview history across devices
                </Text>
              </View>
              
              <View style={styles.authButtonsContainer}>
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.signupButton}
                  onPress={() => navigation.navigate('Signup')}
                >
                  <Text style={styles.signupButtonText}>Create Account</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Animated.View>
      </ScrollView>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
  },
  header: {
    marginBottom: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    color: COLORS.white,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  profileGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButtonText: {
    fontSize: 20,
  },
  xpContainer: {
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.2)',
  },
  levelBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    ...SHADOWS.small,
  },
  levelBadgeIcon: {
    fontSize: 20,
  },
  levelInfo: {
    flex: 1,
  },
  levelText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '700',
    marginBottom: 2,
  },
  xpText: {
    fontSize: 14,
    color: COLORS.lightGray,
    fontWeight: '500',
  },
  xpProgressBar: {
    height: 6,
    backgroundColor: COLORS.darkGray,
    borderRadius: 3,
    overflow: 'hidden',
  },
  xpProgressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
    width: '100%',
    transformOrigin: 'left',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 42,
    color: COLORS.white,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 8,
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  titleAccent: {
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.lightGray,
    textAlign: 'center',
    opacity: 0.9,
    letterSpacing: 0.5,
    lineHeight: 24,
  },
  ctaButton: {
    width: '100%',
    marginBottom: 40,
  },
  ctaButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  quickActions: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    color: COLORS.white,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLORS.darkGray,
    ...SHADOWS.small,
  },
  actionCardCompleted: {
    borderColor: COLORS.success,
    backgroundColor: 'rgba(0, 255, 135, 0.05)',
  },
  actionIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '600',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: COLORS.lightGray,
    opacity: 0.8,
  },
  actionArrow: {
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: '700',
  },
  featuresSection: {
    marginBottom: 40,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  featureCard: {
    width: (width - 52) / 2,
    marginBottom: 12,
  },
  featureGradient: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    minHeight: 140,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    ...SHADOWS.small,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    color: COLORS.lightGray,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 16,
  },
  authSection: {
    marginTop: 20,
  },
  saveProgressCard: {
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.2)',
    alignItems: 'center',
    marginBottom: 20,
    ...SHADOWS.small,
  },
  saveProgressIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  saveProgressTitle: {
    fontSize: 18,
    color: COLORS.white,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  saveProgressText: {
    fontSize: 14,
    color: COLORS.lightGray,
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.9,
  },
  authButtonsContainer: {
    gap: 16,
  },
  loginButton: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 53, 0.05)',
    ...SHADOWS.small,
  },
  loginButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  signupButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  signupButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});