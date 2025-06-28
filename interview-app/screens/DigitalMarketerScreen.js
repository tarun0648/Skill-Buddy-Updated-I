import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SHADOWS, gradientButtonStyle, gradientButtonInner } from '../styles';

const { width } = Dimensions.get('window');

export default function DigitalMarketerScreen() {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;

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

    // Pulse animation for the icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Floating animation for marketing elements
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Sparkle effect
    Animated.loop(
      Animated.timing(sparkleAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={['#0A0A0A', '#1A1A1A', '#0A0A0A']} 
        style={styles.backgroundGradient}
      />
      
      {/* Floating marketing elements */}
      {Array.from({ length: 15 }).map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.floatingElement,
            {
              left: Math.random() * width,
              top: Math.random() * 800,
              transform: [{
                translateY: floatAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -25]
                })
              }, {
                rotate: sparkleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg']
                })
              }]
            }
          ]}
        >
          <Text style={styles.marketingIcon}>
            {['📈', '💰', '🎯', '📱', '💡', '🚀', '📊', '⚡'][Math.floor(Math.random() * 8)]}
          </Text>
        </Animated.View>
      ))}
      
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        {/* Header with enhanced styling */}
        <View style={styles.header}>
          <Animated.View 
            style={[
              styles.iconWrapper,
              { transform: [{ scale: pulseAnim }] }
            ]}
          >
            <LinearGradient
              colors={['#FFD700', '#FF8C42']}
              style={styles.iconContainer}
            >
              <Text style={styles.icon}>📈</Text>
              {/* Sparkle effects around icon */}
              <Animated.View 
                style={[
                  styles.sparkle,
                  styles.sparkle1,
                  {
                    opacity: sparkleAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0, 1, 0]
                    })
                  }
                ]}
              >
                <Text style={styles.sparkleText}>✨</Text>
              </Animated.View>
              <Animated.View 
                style={[
                  styles.sparkle,
                  styles.sparkle2,
                  {
                    opacity: sparkleAnim.interpolate({
                      inputRange: [0, 0.3, 0.8, 1],
                      outputRange: [0, 0, 1, 0]
                    })
                  }
                ]}
              >
                <Text style={styles.sparkleText}>⭐</Text>
              </Animated.View>
            </LinearGradient>
          </Animated.View>
          
          <Text style={styles.title}>Mock Interview</Text>
          <Text style={styles.subtitle}>Digital Marketer</Text>
          <View style={styles.decorativeLine} />
          
          {/* Marketing channels badges */}
          <View style={styles.channelsContainer}>
            {['SEO', 'PPC', 'Social Media', 'Content', 'Email'].map((channel, index) => (
              <Animated.View
                key={channel}
                style={[
                  styles.channelBadge,
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
                <Text style={styles.channelText}>{channel}</Text>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Enhanced Question Card */}
        <View style={styles.questionContainer}>
          <LinearGradient
            colors={['rgba(255, 215, 0, 0.15)', 'rgba(255, 140, 66, 0.05)']}
            style={styles.questionCard}
          >
            <View style={styles.questionHeader}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>CAMPAIGN STRATEGY</Text>
              </View>
              <View style={styles.difficultyIndicator}>
                <Text style={styles.difficultyText}>ADVANCED</Text>
              </View>
            </View>
            
            <Text style={styles.question}>
              Explain how you would run a successful paid advertising campaign. Include strategy, targeting, budget allocation, and performance measurement.
            </Text>
            
            {/* Campaign framework preview */}
            <View style={styles.frameworkPreview}>
              <Text style={styles.previewLabel}>Campaign Framework:</Text>
              <View style={styles.stepsContainer}>
                {[
                  { step: '1', label: 'Research & Planning', icon: '🔍' },
                  { step: '2', label: 'Audience Targeting', icon: '🎯' },
                  { step: '3', label: 'Creative Development', icon: '🎨' },
                  { step: '4', label: 'Budget & Bidding', icon: '💰' },
                  { step: '5', label: 'Launch & Monitor', icon: '🚀' },
                  { step: '6', label: 'Optimize & Scale', icon: '📊' }
                ].map((item, index) => (
                  <Animated.View 
                    key={item.step}
                    style={[
                      styles.stepItem,
                      {
                        opacity: fadeAnim,
                        transform: [{
                          translateX: fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [30, 0]
                          })
                        }]
                      }
                    ]}
                  >
                    <Text style={styles.stepIcon}>{item.icon}</Text>
                    <Text style={styles.stepNumber}>{item.step}</Text>
                    <Text style={styles.stepLabel}>{item.label}</Text>
                  </Animated.View>
                ))}
              </View>
            </View>
            
            <View style={[styles.questionAccent, { backgroundColor: '#FFD700' }]} />
          </LinearGradient>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <LinearGradient
            colors={['#FFD700', '#FF8C42']}
            style={[gradientButtonStyle, styles.actionButton]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <TouchableOpacity
              style={gradientButtonInner}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.actionButtonText}>⏭️ Skip Question</Text>
            </TouchableOpacity>
          </LinearGradient>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Interview', { careerPath: 'DigitalMarketer' })}
          >
            <Text style={styles.secondaryButtonText}>🎯 Answer Question</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.endButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.endButtonText}>⏹️ End Interview</Text>
          </TouchableOpacity>
        </View>

        {/* Tips Section */}
        <View style={styles.tipsContainer}>
          <LinearGradient
            colors={['rgba(255, 215, 0, 0.1)', 'rgba(255, 215, 0, 0.05)']}
            style={styles.tipsCard}
          >
            <Text style={styles.tipsTitle}>💡 Pro Marketing Tip</Text>
            <Text style={styles.tipsText}>
              Structure your answer using the RACE framework: Research, Action, Communication, Evaluation. 
              Mention specific platforms (Google Ads, Facebook Ads) and KPIs (ROAS, CTR, CPA).
            </Text>
          </LinearGradient>
        </View>
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
  floatingElement: {
    position: 'absolute',
    opacity: 0.4,
  },
  marketingIcon: {
    fontSize: 16,
    color: '#FFD700',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconWrapper: {
    position: 'relative',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    ...SHADOWS.large,
  },
  icon: {
    fontSize: 48,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  sparkle: {
    position: 'absolute',
  },
  sparkle1: {
    top: -10,
    right: -5,
  },
  sparkle2: {
    bottom: -8,
    left: -5,
  },
  sparkleText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  title: {
    fontSize: 32,
    color: COLORS.white,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: '#FFD700',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 20,
    color: '#FFD700',
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
    letterSpacing: 0.5,
  },
  questionContainer: {
    marginBottom: 30,
  },
  questionCard: {
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    ...SHADOWS.large,
    position: 'relative',
    overflow: 'hidden',
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  categoryText: {
    fontSize: 10,
    color: '#FFD700',
    fontWeight: '700',
    letterSpacing: 1,
  },
  difficultyIndicator: {
    backgroundColor: '#FF4757',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 1,
  },
  question: {
    fontSize: 18,
    color: COLORS.white,
    lineHeight: 28,
    fontWeight: '500',
    letterSpacing: 0.3,
    textAlign: 'center',
    marginBottom: 20,
  },
  frameworkPreview: {
    marginTop: 16,
    padding: 16,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  previewLabel: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  stepsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  stepItem: {
    alignItems: 'center',
    width: '30%',
    marginBottom: 12,
  },
  stepIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  stepNumber: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '700',
    marginBottom: 2,
  },
  stepLabel: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 12,
  },
  questionAccent: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 6,
    height: '100%',
    borderRadius: 3,
  },
  buttonContainer: {
    gap: 16,
    marginBottom: 20,
  },
  actionButton: {
    width: '100%',
  },
  actionButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    textShadowColor: '#FFFFFF',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: '#FFD700',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
    ...SHADOWS.small,
  },
  secondaryButtonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  endButton: {
    borderWidth: 2,
    borderColor: COLORS.error,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 71, 87, 0.05)',
    ...SHADOWS.small,
  },
  endButtonText: {
    color: COLORS.error,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  tipsContainer: {
    marginTop: 20,
  },
  tipsCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
    ...SHADOWS.small,
  },
  tipsTitle: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  tipsText: {
    fontSize: 14,
    color: COLORS.lightGray,
    lineHeight: 20,
    opacity: 0.9,
    letterSpacing: 0.3,
  },
  decorativeLine: {
    width: 80,
    height: 3,
    backgroundColor: '#FFD700',
    borderRadius: 2,
    marginBottom: 20,
  },
  channelsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  channelBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.4)',
  },
  channelText: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});