// screens/ProfileScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  ActivityIndicator,
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

// Using default export
export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const { totalXP, level, getLevelBadge, achievements, getProgressPercentage } = useXP();
  
  const [profileData, setProfileData] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const statsAnims = useRef([0, 1, 2, 3].map(() => new Animated.Value(0))).current;

  useEffect(() => {
    loadProfileData();
    
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

    // Animate stats cards
    const statAnimations = statsAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 600,
        delay: 200 + (index * 150),
        useNativeDriver: true,
      })
    );
    Animated.parallel(statAnimations).start();
  }, []);

  const loadProfileData = async () => {
    try {
      setIsLoading(true);
      
      if (user && user.uid) {
        // Load user profile with complete statistics
        const profileResponse = await apiService.getUserProfile(user.uid);
        setProfileData(profileResponse);
        
        // For now, we'll use empty sessions array since the API method doesn't exist yet
        setSessions([]);
      }
      
    } catch (error) {
      console.error('Error loading profile:', error);
      // Continue with default data
      setProfileData({
        user: user,
        statistics: {
          total_sessions: 0,
          completed_sessions: 0,
          completion_rate: 0,
          career_paths: {},
          total_questions_answered: 0
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.navigate('Intro');
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return COLORS.success;
      case 'in_progress':
        return COLORS.warning;
      default:
        return COLORS.error;
    }
  };

  const levelBadge = getLevelBadge(level);

  const StatCard = ({ title, value, subtitle, index, icon, color = COLORS.primary }) => (
    <Animated.View
      style={[
        styles.statCard,
        {
          opacity: statsAnims[index],
          transform: [{
            translateY: statsAnims[index].interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0]
            })
          }]
        }
      ]}
    >
      <LinearGradient
        colors={[`${color}20`, `${color}10`]}
        style={styles.statCardGradient}
      >
        <Text style={styles.statIcon}>{icon}</Text>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
        <View style={[styles.statAccent, { backgroundColor: color }]} />
      </LinearGradient>
    </Animated.View>
  );

  const SessionCard = ({ session, index }) => (
    <Animated.View
      style={[
        styles.sessionCard,
        {
          opacity: fadeAnim,
          transform: [{
            translateX: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0]
            })
          }]
        }
      ]}
    >
      <LinearGradient
        colors={['rgba(255, 107, 53, 0.1)', 'rgba(255, 107, 53, 0.05)']}
        style={styles.sessionCardGradient}
      >
        <View style={styles.sessionHeader}>
          <Text style={styles.sessionCareer}>{session.career_path}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(session.status) }]}>
            <Text style={styles.statusText}>{session.status}</Text>
          </View>
        </View>
        
        <Text style={styles.sessionDate}>
          Started: {formatDate(session.started_at)}
        </Text>
        
        {session.completed_at && (
          <Text style={styles.sessionDate}>
            Completed: {formatDate(session.completed_at)}
          </Text>
        )}
        
        <View style={styles.sessionMetrics}>
          <Text style={styles.sessionResponses}>
            Responses: {session.responses?.length || 0}
          </Text>
          {session.xp_earned && (
            <Text style={styles.sessionXP}>
              +{session.xp_earned} XP
            </Text>
          )}
        </View>
        
        <View style={styles.sessionAccent} />
      </LinearGradient>
    </Animated.View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient 
          colors={['#0A0A0A', '#1A1A1A', '#0A0A0A']} 
          style={styles.backgroundGradient}
        />
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

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
          {/* Enhanced Header with Level Badge */}
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={['#FF6B35', '#FF4757']}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>
                  {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                </Text>
              </LinearGradient>
              
              {/* Level Badge */}
              <View style={[styles.levelBadge, { backgroundColor: levelBadge.color }]}>
                <Text style={styles.levelBadgeText}>{level}</Text>
              </View>
              
              <View style={styles.onlineIndicator} />
            </View>
            
            <Text style={styles.title}>
              {user?.first_name || user?.last_name 
                ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                : 'My Profile'
              }
            </Text>
            <Text style={styles.email}>{user?.email}</Text>
            
            {/* Level and XP Info */}
            <View style={styles.levelContainer}>
              <Text style={styles.levelTitle}>
                {levelBadge.icon} {levelBadge.name}
              </Text>
              <Text style={styles.xpText}>
                {totalXP} XP • Level {level}
              </Text>
              
              {/* XP Progress Bar */}
              <View style={styles.xpProgressContainer}>
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
                <Text style={styles.xpProgressText}>
                  {Math.round(getProgressPercentage())}% to next level
                </Text>
              </View>
            </View>
          </View>

          {/* Enhanced Statistics */}
          {profileData?.statistics && (
            <View style={styles.statsContainer}>
              <Text style={styles.sectionTitle}>📊 Interview Statistics</Text>
              
              <View style={styles.statsGrid}>
                <StatCard
                  title="Total"
                  value={profileData.statistics.total_sessions}
                  subtitle="Interviews"
                  index={0}
                  icon="📊"
                  color={COLORS.primary}
                />
                
                <StatCard
                  title="Completed"
                  value={profileData.statistics.completed_sessions}
                  subtitle="Sessions"
                  index={1}
                  icon="✅"
                  color={COLORS.success}
                />
              </View>
              
              <View style={styles.statsGrid}>
                <StatCard
                  title="Success Rate"
                  value={`${Math.round(profileData.statistics.completion_rate)}%`}
                  index={2}
                  icon="🎯"
                  color={COLORS.warning}
                />
                
                <StatCard
                  title="Questions"
                  value={profileData.statistics.total_questions_answered || 0}
                  subtitle="Answered"
                  index={3}
                  icon="❓"
                  color="#6C63FF"
                />
              </View>

              {/* Career Paths */}
              {Object.keys(profileData.statistics.career_paths || {}).length > 0 && (
                <View style={styles.careerPathsContainer}>
                  <Text style={styles.subSectionTitle}>Career Paths Practiced</Text>
                  {Object.entries(profileData.statistics.career_paths).map(([career, count], index) => (
                    <Animated.View 
                      key={career}
                      style={[
                        styles.careerPathRow,
                        {
                          opacity: fadeAnim,
                          transform: [{
                            translateX: fadeAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [-30, 0]
                            })
                          }]
                        }
                      ]}
                    >
                      <Text style={styles.careerPathName}>{career}</Text>
                      <View style={styles.careerPathBadge}>
                        <Text style={styles.careerPathCount}>{count}</Text>
                      </View>
                    </Animated.View>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Achievements Section */}
          {achievements && achievements.length > 0 && (
            <View style={styles.achievementsContainer}>
              <Text style={styles.sectionTitle}>🏆 Recent Achievements</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {achievements.slice(0, 5).map((achievement, index) => (
                  <View key={index} style={styles.achievementCard}>
                    <Text style={styles.achievementIcon}>🎉</Text>
                    <Text style={styles.achievementTitle}>{achievement.type}</Text>
                    <Text style={styles.achievementDescription}>{achievement.description}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Profile Links Section */}
          {(user?.github_profile || user?.linkedin_profile || user?.resume_uploaded) && (
            <View style={styles.profileLinksContainer}>
              <Text style={styles.sectionTitle}>🔗 Profile Links</Text>
              
              {user.github_profile && (
                <View style={styles.linkCard}>
                  <Text style={styles.linkIcon}>🐙</Text>
                  <Text style={styles.linkText}>github.com/{user.github_profile}</Text>
                </View>
              )}
              
              {user.linkedin_profile && (
                <View style={styles.linkCard}>
                  <Text style={styles.linkIcon}>💼</Text>
                  <Text style={styles.linkText}>linkedin.com/in/{user.linkedin_profile}</Text>
                </View>
              )}
              
              {user.resume_uploaded && (
                <View style={styles.linkCard}>
                  <Text style={styles.linkIcon}>📄</Text>
                  <Text style={styles.linkText}>{user.resume_file_name}</Text>
                </View>
              )}
            </View>
          )}

          {/* Recent Sessions */}
          <View style={styles.sessionsContainer}>
            <Text style={styles.sectionTitle}>🕒 Recent Interviews</Text>
            
            {sessions.length === 0 ? (
              <View style={styles.noSessionsContainer}>
                <Text style={styles.noSessionsIcon}>🎯</Text>
                <Text style={styles.noSessionsText}>
                  No interviews completed yet.
                </Text>
                <Text style={styles.noSessionsSubtext}>
                  Start your first interview to track your progress!
                </Text>
              </View>
            ) : (
              sessions.slice(0, 5).map((session, index) => (
                <SessionCard key={session.id || index} session={session} index={index} />
              ))
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <LinearGradient
              colors={['#FF6B35', '#FF4757']}
              style={[gradientButtonStyle, styles.primaryButton]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <TouchableOpacity
                style={gradientButtonInner}
                onPress={() => navigation.navigate('Questions')}
              >
                <Text style={styles.primaryButtonText}>🚀 Start New Interview</Text>
              </TouchableOpacity>
            </LinearGradient>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.secondaryButtonText}>🏠 Back to Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonText}>⚡ Logout</Text>
            </TouchableOpacity>
          </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    color: COLORS.white,
    fontSize: 18,
    marginTop: 16,
    fontWeight: '500',
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
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.large,
  },
  avatarText: {
    fontSize: 32,
    color: COLORS.white,
    fontWeight: '800',
  },
  levelBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.background,
  },
  levelBadgeText: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '700',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.success,
    borderWidth: 3,
    borderColor: COLORS.background,
  },
  title: {
    fontSize: 28,
    color: COLORS.white,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    color: COLORS.lightGray,
    opacity: 0.9,
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  levelContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.2)',
  },
  levelTitle: {
    fontSize: 18,
    color: COLORS.white,
    fontWeight: '700',
    marginBottom: 4,
  },
  xpText: {
    fontSize: 14,
    color: COLORS.lightGray,
    marginBottom: 12,
  },
  xpProgressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  xpProgressBar: {
    width: '100%',
    height: 6,
    backgroundColor: COLORS.darkGray,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  xpProgressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
    width: '100%',
    transformOrigin: 'left',
  },
  xpProgressText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  statsContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    color: COLORS.white,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
  },
  statCardGradient: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.2)',
    ...SHADOWS.small,
    position: 'relative',
    overflow: 'hidden',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statSubtitle: {
    fontSize: 10,
    color: COLORS.lightGray,
    textAlign: 'center',
    marginTop: 2,
    opacity: 0.8,
  },
  statAccent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  careerPathsContainer: {
    backgroundColor: 'rgba(255, 107, 53, 0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.2)',
    ...SHADOWS.small,
    marginBottom: 20,
  },
  subSectionTitle: {
    fontSize: 16,
    color: COLORS.white,
    marginBottom: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  careerPathRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
  },
  careerPathName: {
    fontSize: 14,
    color: COLORS.lightGray,
    fontWeight: '500',
    flex: 1,
  },
  careerPathBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 40,
    alignItems: 'center',
  },
  careerPathCount: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: '700',
  },
  achievementsContainer: {
    marginBottom: 30,
  },
  achievementCard: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
    alignItems: 'center',
    minWidth: 150,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  achievementDescription: {
    fontSize: 12,
    color: COLORS.lightGray,
    textAlign: 'center',
    lineHeight: 16,
  },
  profileLinksContainer: {
    marginBottom: 30,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 53, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.2)',
  },
  linkIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  linkText: {
    fontSize: 14,
    color: COLORS.lightGray,
    fontWeight: '500',
  },
  sessionsContainer: {
    marginBottom: 30,
  },
  noSessionsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: 'rgba(255, 107, 53, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.2)',
  },
  noSessionsIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  noSessionsText: {
    fontSize: 18,
    color: COLORS.white,
    fontWeight: '600',
    marginBottom: 8,
  },
  noSessionsSubtext: {
    fontSize: 14,
    color: COLORS.lightGray,
    textAlign: 'center',
    opacity: 0.8,
  },
  sessionCard: {
    marginBottom: 16,
  },
  sessionCardGradient: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.2)',
    ...SHADOWS.small,
    position: 'relative',
    overflow: 'hidden',
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sessionCareer: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '700',
    flex: 1,
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: COLORS.white,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  sessionDate: {
    fontSize: 12,
    color: COLORS.lightGray,
    opacity: 0.8,
    marginBottom: 4,
  },
  sessionMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  sessionResponses: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  sessionXP: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: '700',
  },
  sessionAccent: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 4,
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  buttonContainer: {
    gap: 16,
  },
  primaryButton: {
    width: '100%',
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 53, 0.05)',
    ...SHADOWS.small,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  logoutButton: {
    borderWidth: 2,
    borderColor: COLORS.error,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 71, 87, 0.05)',
    ...SHADOWS.small,
  },
  logoutButtonText: {
    color: COLORS.error,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});