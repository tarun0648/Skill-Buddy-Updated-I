// screens/InterviewResultsScreen.js
import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Alert,
  TextInput,
  ActivityIndicator,
  Animated,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, SHADOWS, gradientButtonStyle, gradientButtonInner } from '../styles';
import { useXP } from '../context/XPContext';

const { width } = Dimensions.get('window');

export default function InterviewResultsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { careerPath, responses = [], questions = [] } = route.params || {};
  const { addXP, getXPRewards } = useXP();
  
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [showRoulette, setShowRoulette] = useState(false);
  const [rouletteSpinning, setRouletteSpinning] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [showXPAnimation, setShowXPAnimation] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const rouletteRotation = useRef(new Animated.Value(0)).current;
  const xpAnimation = useRef(new Animated.Value(0)).current;
  const celebrationAnim = useRef(new Animated.Value(0)).current;

  // European roulette wheel layout (authentic casino order)
  const rouletteSegments = [
    { number: '0', value: 300, color: '#228B22', textColor: '#FFFFFF' },
    { number: '32', value: 50, color: '#DC143C', textColor: '#FFFFFF' },
    { number: '15', value: 75, color: '#000000', textColor: '#FFFFFF' },
    { number: '19', value: 100, color: '#DC143C', textColor: '#FFFFFF' },
    { number: '4', value: 50, color: '#000000', textColor: '#FFFFFF' },
    { number: '21', value: 125, color: '#DC143C', textColor: '#FFFFFF' },
    { number: '2', value: 75, color: '#000000', textColor: '#FFFFFF' },
    { number: '25', value: 100, color: '#DC143C', textColor: '#FFFFFF' },
    { number: '17', value: 50, color: '#000000', textColor: '#FFFFFF' },
    { number: '34', value: 150, color: '#DC143C', textColor: '#FFFFFF' },
    { number: '6', value: 75, color: '#000000', textColor: '#FFFFFF' },
    { number: '27', value: 100, color: '#DC143C', textColor: '#FFFFFF' },
    { number: '13', value: 50, color: '#000000', textColor: '#FFFFFF' },
    { number: '36', value: 125, color: '#DC143C', textColor: '#FFFFFF' },
    { number: '11', value: 75, color: '#000000', textColor: '#FFFFFF' },
    { number: '30', value: 100, color: '#DC143C', textColor: '#FFFFFF' },
    { number: '8', value: 50, color: '#000000', textColor: '#FFFFFF' },
    { number: '23', value: 125, color: '#DC143C', textColor: '#FFFFFF' },
    { number: '10', value: 75, color: '#000000', textColor: '#FFFFFF' },
    { number: '5', value: 100, color: '#DC143C', textColor: '#FFFFFF' },
    { number: '24', value: 50, color: '#000000', textColor: '#FFFFFF' },
    { number: '16', value: 125, color: '#DC143C', textColor: '#FFFFFF' },
    { number: '33', value: 75, color: '#000000', textColor: '#FFFFFF' },
    { number: '1', value: 100, color: '#DC143C', textColor: '#FFFFFF' },
    { number: '20', value: 50, color: '#000000', textColor: '#FFFFFF' },
    { number: '14', value: 125, color: '#DC143C', textColor: '#FFFFFF' },
    { number: '31', value: 75, color: '#000000', textColor: '#FFFFFF' },
    { number: '9', value: 100, color: '#DC143C', textColor: '#FFFFFF' },
    { number: '22', value: 50, color: '#000000', textColor: '#FFFFFF' },
    { number: '18', value: 125, color: '#DC143C', textColor: '#FFFFFF' },
    { number: '29', value: 75, color: '#000000', textColor: '#FFFFFF' },
    { number: '7', value: 100, color: '#DC143C', textColor: '#FFFFFF' },
    { number: '28', value: 50, color: '#000000', textColor: '#FFFFFF' },
    { number: '12', value: 125, color: '#DC143C', textColor: '#FFFFFF' },
    { number: '35', value: 75, color: '#000000', textColor: '#FFFFFF' },
    { number: '3', value: 100, color: '#DC143C', textColor: '#FFFFFF' },
    { number: '26', value: 50, color: '#000000', textColor: '#FFFFFF' }
  ];

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
      Animated.timing(celebrationAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();

    // Show roulette after a short delay
    setTimeout(() => {
      setShowRoulette(true);
    }, 1000);
  }, []);

  const spinRoulette = () => {
    setRouletteSpinning(true);
    
    // Random number of rotations (8-15 full rotations plus random position)
    const spins = Math.floor(Math.random() * 7) + 8;
    const randomSegment = Math.floor(Math.random() * rouletteSegments.length);
    const segmentAngle = 360 / rouletteSegments.length;
    const finalAngle = spins * 360 + (randomSegment * segmentAngle);
    
    Animated.timing(rouletteRotation, {
      toValue: finalAngle,
      duration: 4000,
      useNativeDriver: true,
    }).start(() => {
      const wonSegment = rouletteSegments[randomSegment];
      const earnedXP = wonSegment.value;
      
      setXpEarned(earnedXP);
      addXP(earnedXP, 'Interview Completion Bonus');
      setRouletteSpinning(false);
      setShowXPAnimation(true);
      
      // Animate XP counter
      Animated.sequence([
        Animated.timing(xpAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.delay(2500),
        Animated.timing(xpAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        })
      ]).start(() => {
        setShowXPAnimation(false);
      });
    });
  };

  const handleSubmitFeedback = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please provide a rating before submitting.');
      return;
    }

    setIsSubmittingFeedback(true);
    
    // Add bonus XP for providing feedback
    const feedbackXP = 25;
    addXP(feedbackXP, 'Feedback Provided');
    
    // Simulate submitting feedback
    setTimeout(() => {
      Alert.alert(
        'Thank You!',
        `Your feedback has been recorded. You earned ${feedbackXP} bonus XP for providing feedback!`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
      setIsSubmittingFeedback(false);
    }, 1000);
  };

  const renderRoulette = () => {
    if (!showRoulette) return null;

    const wheelSize = Math.min(width * 0.8, 300);
    const segmentAngle = 360 / rouletteSegments.length;
    const segmentRadius = (wheelSize - 30) / 2;

    return (
      <Animated.View 
        style={[
          styles.rouletteContainer,
          {
            opacity: fadeAnim,
            transform: [{
              scale: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1]
              })
            }]
          }
        ]}
      >
        <Text style={styles.rouletteTitle}>🎰 Vegas Bonus Wheel! 🎰</Text>
        <Text style={styles.rouletteSubtitle}>Spin to win bonus XP!</Text>
        
        <View style={[styles.rouletteWheel, { width: wheelSize, height: wheelSize }]}>
          {/* Outer decorative rim */}
          <View style={[styles.wheelOuterRim, { width: wheelSize + 20, height: wheelSize + 20 }]} />
          
          {/* Main rim */}
          <View style={[styles.wheelRim, { width: wheelSize, height: wheelSize }]} />
          
          {/* Inner wheel with segments */}
          <Animated.View
            style={[
              styles.wheel,
              {
                width: wheelSize - 30,
                height: wheelSize - 30,
                borderRadius: (wheelSize - 30) / 2,
                transform: [{
                  rotate: rouletteRotation.interpolate({
                    inputRange: [0, 360],
                    outputRange: ['0deg', '360deg']
                  })
                }]
              }
            ]}
          >
            {/* Background circle */}
            <View style={[styles.wheelBackground, {
              width: wheelSize - 30,
              height: wheelSize - 30,
              borderRadius: (wheelSize - 30) / 2,
            }]} />
            
            {/* Segments */}
            {rouletteSegments.map((segment, index) => {
              const rotation = segmentAngle * index;
              
              return (
                <View
                  key={index}
                  style={[
                    styles.segment,
                    {
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: segmentRadius,
                      height: 2,
                      backgroundColor: segment.color,
                      transformOrigin: '0px 0px',
                      transform: [
                        { translateX: -1 },
                        { translateY: -1 },
                        { rotate: `${rotation}deg` }
                      ],
                    }
                  ]}
                >
                  {/* Number label positioned at the edge */}
                  <View style={[styles.numberContainer, {
                    position: 'absolute',
                    right: -12,
                    top: -8,
                    width: 24,
                    height: 16,
                    backgroundColor: segment.color,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#FFD700',
                  }]}>
                    <Text style={[styles.segmentNumber, { 
                      color: segment.textColor,
                      fontSize: 8,
                      fontWeight: '700'
                    }]}>
                      {segment.number}
                    </Text>
                  </View>
                </View>
              );
            })}
            
            {/* Radial dividers */}
            {rouletteSegments.map((_, index) => (
              <View
                key={`divider-${index}`}
                style={[
                  styles.segmentDivider,
                  {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: segmentRadius,
                    height: 1,
                    backgroundColor: '#FFD700',
                    transformOrigin: '0px 0px',
                    transform: [
                      { translateY: -0.5 },
                      { rotate: `${segmentAngle * index}deg` }
                    ],
                  }
                ]}
              />
            ))}
          </Animated.View>
          
          {/* Center hub with spokes */}
          <View style={[styles.centerHub, { 
            width: wheelSize * 0.12, 
            height: wheelSize * 0.12,
            borderRadius: (wheelSize * 0.12) / 2 
          }]}>
            {/* Decorative spokes */}
            {[0, 45, 90, 135].map((angle, index) => (
              <View
                key={index}
                style={[
                  styles.spoke,
                  {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: wheelSize * 0.08,
                    height: 2,
                    backgroundColor: '#8B4513',
                    transformOrigin: '0px 0px',
                    transform: [
                      { translateX: -wheelSize * 0.04 },
                      { translateY: -1 },
                      { rotate: `${angle}deg` }
                    ],
                  }
                ]}
              />
            ))}
          </View>
          
          {/* Pointer/Ball */}
          <View style={[styles.pointer, { top: -18 }]} />
        </View>
        
        <TouchableOpacity
          style={[styles.spinButton, { opacity: rouletteSpinning ? 0.5 : 1 }]}
          onPress={spinRoulette}
          disabled={rouletteSpinning}
        >
          <LinearGradient
            colors={rouletteSpinning ? ['#666666', '#444444'] : ['#FFD700', '#FFA500']}
            style={styles.spinButtonGradient}
          >
            <Text style={styles.spinButtonText}>
              {rouletteSpinning ? 'SPINNING...' : 'SPIN TO WIN!'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderXPAnimation = () => {
    if (!showXPAnimation) return null;

    return (
      <Animated.View
        style={[
          styles.xpAnimationContainer,
          {
            opacity: xpAnimation,
            transform: [{
              scale: xpAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1]
              })
            }]
          }
        ]}
      >
        <Text style={styles.xpAnimationIcon}>🎉</Text>
        <Text style={styles.xpAnimationText}>+{xpEarned} XP</Text>
        <Text style={styles.xpAnimationSubtext}>Bonus Experience!</Text>
      </Animated.View>
    );
  };

  const renderStarRating = () => {
    return (
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            style={styles.star}
          >
            <Text style={[
              styles.starText,
              { color: star <= rating ? '#FFD700' : '#666666' }
            ]}>
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const completionRate = Math.round((responses.length / questions.length) * 100);

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
          {/* Celebration Header */}
          <Animated.View 
            style={[
              styles.header,
              {
                transform: [{
                  scale: celebrationAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1]
                  })
                }]
              }
            ]}
          >
            <Text style={styles.celebrationIcon}>🎉</Text>
            <Text style={styles.title}>Interview Complete!</Text>
            <Text style={styles.subtitle}>
              Outstanding work on your {careerPath} interview!
            </Text>
          </Animated.View>

          {/* Interview Summary */}
          <View style={styles.summaryContainer}>
            <LinearGradient
              colors={['rgba(0, 255, 135, 0.1)', 'rgba(0, 255, 135, 0.05)']}
              style={styles.summaryCard}
            >
              <Text style={styles.sectionTitle}>📊 Interview Summary</Text>
              
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{responses.length}</Text>
                  <Text style={styles.statLabel}>Questions Answered</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{questions.length}</Text>
                  <Text style={styles.statLabel}>Total Questions</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: completionRate === 100 ? COLORS.success : COLORS.warning }]}>
                    {completionRate}%
                  </Text>
                  <Text style={styles.statLabel}>Completion Rate</Text>
                </View>
              </View>

              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                  <Animated.View 
                    style={[
                      styles.progressFill,
                      {
                        transform: [{
                          scaleX: celebrationAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, completionRate / 100]
                          })
                        }]
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>Great progress!</Text>
              </View>
            </LinearGradient>
          </View>

          {/* Vegas Roulette Wheel */}
          {renderRoulette()}

          {/* XP Animation */}
          {renderXPAnimation()}

          {/* Feedback Section */}
          <View style={styles.feedbackContainer}>
            <LinearGradient
              colors={['rgba(255, 107, 53, 0.1)', 'rgba(255, 107, 53, 0.05)']}
              style={styles.feedbackCard}
            >
              <Text style={styles.sectionTitle}>⭐ Rate Your Experience</Text>
              
              <Text style={styles.ratingLabel}>How would you rate this interview?</Text>
              {renderStarRating()}
              
              <Text style={styles.feedbackLabel}>Additional Comments (Optional):</Text>
              <View style={styles.feedbackInputContainer}>
                <TextInput
                  style={styles.feedbackInput}
                  value={feedback}
                  onChangeText={setFeedback}
                  multiline
                  numberOfLines={4}
                  placeholder="Share your thoughts about the interview experience..."
                  placeholderTextColor="#888888"
                  textAlignVertical="top"
                />
              </View>
            </LinearGradient>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <LinearGradient
              colors={['#FF6B35', '#FF4757']}
              style={[gradientButtonStyle, styles.submitButton]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <TouchableOpacity
                style={[gradientButtonInner, { opacity: isSubmittingFeedback ? 0.7 : 1 }]}
                onPress={handleSubmitFeedback}
                disabled={isSubmittingFeedback}
              >
                {isSubmittingFeedback ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={COLORS.white} />
                    <Text style={styles.loadingText}>Submitting...</Text>
                  </View>
                ) : (
                  <Text style={styles.submitButtonText}>🎯 Submit Feedback (+25 XP)</Text>
                )}
              </TouchableOpacity>
            </LinearGradient>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.secondaryButtonText}>🏠 Back to Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => navigation.navigate('Questions')}
            >
              <Text style={styles.retryButtonText}>🔄 Take Another Interview</Text>
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
    marginBottom: 30,
  },
  celebrationIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    color: COLORS.white,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 12,
    textAlign: 'center',
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.lightGray,
    textAlign: 'center',
    opacity: 0.9,
    letterSpacing: 0.5,
    lineHeight: 24,
  },
  summaryContainer: {
    marginBottom: 30,
  },
  summaryCard: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 135, 0.2)',
    ...SHADOWS.medium,
  },
  sectionTitle: {
    fontSize: 20,
    color: COLORS.white,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    color: COLORS.success,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.lightGray,
    textAlign: 'center',
    opacity: 0.8,
    fontWeight: '500',
  },
  progressBarContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: COLORS.darkGray,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.success,
    borderRadius: 4,
    width: '100%',
    transformOrigin: 'left',
  },
  progressText: {
    fontSize: 14,
    color: COLORS.success,
    fontWeight: '600',
  },
  rouletteContainer: {
    backgroundColor: '#0F1419',
    padding: 25,
    borderRadius: 20,
    marginBottom: 30,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFD700',
    ...SHADOWS.neon,
  },
  rouletteTitle: {
    fontSize: 22,
    color: '#FFD700',
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  rouletteSubtitle: {
    fontSize: 14,
    color: COLORS.lightGray,
    marginBottom: 25,
    textAlign: 'center',
  },
  rouletteWheel: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
  wheelOuterRim: {
    position: 'absolute',
    borderRadius: 1000,
    borderWidth: 8,
    borderColor: '#B8860B',
    backgroundColor: 'transparent',
    ...SHADOWS.neon,
  },
  wheelRim: {
    position: 'absolute',
    borderRadius: 1000,
    borderWidth: 6,
    borderColor: '#8B4513',
    backgroundColor: '#654321',
    ...SHADOWS.large,
  },
  wheel: {
    position: 'relative',
    backgroundColor: '#1a1a1a',
    borderWidth: 3,
    borderColor: '#FFD700',
    ...SHADOWS.medium,
  },
  wheelBackground: {
    position: 'absolute',
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  segment: {
    borderTopWidth: 0.5,
    borderTopColor: '#FFD700',
  },
  numberContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  segmentDivider: {
    opacity: 0.8,
  },
  segmentNumber: {
    textAlign: 'center',
    textShadowColor: '#000000',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  centerHub: {
    position: 'absolute',
    backgroundColor: '#FFD700',
    borderWidth: 4,
    borderColor: '#B8860B',
    ...SHADOWS.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spoke: {
    borderRadius: 1,
  },
  pointer: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 30,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FF0000',
    zIndex: 10,
    ...SHADOWS.medium,
  },
  spinButton: {
    borderRadius: 30,
    ...SHADOWS.large,
  },
  spinButtonGradient: {
    paddingHorizontal: 35,
    paddingVertical: 15,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  spinButtonText: {
    fontSize: 18,
    color: '#000000',
    fontWeight: '700',
    textShadowColor: '#FFFFFF',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  xpAnimationContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -75 }],
    backgroundColor: 'rgba(255, 215, 0, 0.95)',
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    zIndex: 1000,
    width: 200,
    borderWidth: 3,
    borderColor: '#FFA500',
    ...SHADOWS.neon,
  },
  xpAnimationIcon: {
    fontSize: 30,
    marginBottom: 10,
  },
  xpAnimationText: {
    fontSize: 28,
    color: '#000000',
    fontWeight: '700',
    textShadowColor: '#FFFFFF',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  xpAnimationSubtext: {
    fontSize: 16,
    color: '#000000',
    marginTop: 5,
    fontWeight: '600',
  },
  feedbackContainer: {
    marginBottom: 30,
  },
  feedbackCard: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.2)',
    ...SHADOWS.medium,
  },
  ratingLabel: {
    fontSize: 16,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: '500',
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 8,
  },
  star: {
    padding: 4,
  },
  starText: {
    fontSize: 32,
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  feedbackLabel: {
    fontSize: 16,
    color: COLORS.white,
    marginBottom: 12,
    fontWeight: '500',
  },
  feedbackInputContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.darkGray,
    ...SHADOWS.small,
  },
  feedbackInput: {
    color: COLORS.white,
    fontSize: 16,
    padding: 16,
    minHeight: 100,
    fontWeight: '400',
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 16,
  },
  submitButton: {
    width: '100%',
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
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
  retryButton: {
    borderWidth: 2,
    borderColor: COLORS.success,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 135, 0.05)',
    ...SHADOWS.small,
  },
  retryButtonText: {
    color: COLORS.success,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});