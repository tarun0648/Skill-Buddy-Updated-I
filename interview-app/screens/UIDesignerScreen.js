import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SHADOWS, gradientButtonStyle, gradientButtonInner } from '../styles';

const { width } = Dimensions.get('window');

export default function UIDesignerScreen() {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

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
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Floating animation for design elements
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Rotation animation for design tools
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
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
      
      {/* Floating design elements */}
      {Array.from({ length: 18 }).map((_, index) => (
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
                  outputRange: [0, -20]
                })
              }, {
                rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg']
                })
              }]
            }
          ]}
        >
          <Text style={styles.designIcon}>
            {['🎨', '✏️', '📐', '🖌️', '🎭', '💎', '⚡', '🌈', '✨'][Math.floor(Math.random() * 9)]}
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
              colors={['#00FF87', '#00D9FF']}
              style={styles.iconContainer}
            >
              <Text style={styles.icon}>🎨</Text>
              {/* Design grid overlay */}
              <View style={styles.gridOverlay}>
                {Array.from({ length: 16 }).map((_, i) => (
                  <View key={i} style={styles.gridDot} />
                ))}
              </View>
            </LinearGradient>
          </Animated.View>
          
          <Text style={styles.title}>Mock Interview</Text>
          <Text style={styles.subtitle}>UI/UX Designer</Text>
          <View style={styles.decorativeLine} />
          
          {/* Design tools badges */}
          <View style={styles.toolsContainer}>
            {['Figma', 'Sketch', 'Adobe XD', 'Prototyping', 'User Research'].map((tool, index) => (
              <Animated.View
                key={tool}
                style={[
                  styles.toolBadge,
                  {
                    opacity: fadeAnim,
                    transform: [{
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0]
                      })
                    }]
                  }
                ]}
              >
                <Text style={styles.toolText}>{tool}</Text>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Enhanced Question Card */}
        <View style={styles.questionContainer}>
          <LinearGradient
            colors={['rgba(0, 255, 135, 0.15)', 'rgba(0, 217, 255, 0.05)']}
            style={styles.questionCard}
          >
            <View style={styles.questionHeader}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>USER RESEARCH</Text>
              </View>
              <View style={styles.difficultyIndicator}>
                <Text style={styles.difficultyText}>INTERMEDIATE</Text>
              </View>
            </View>
            
            <Text style={styles.question}>
              How do you approach user research for a new design project? Walk through your research methodology and how you translate insights into design decisions.
            </Text>
            
            {/* Design process preview */}
            <View style={styles.processPreview}>
              <Text style={styles.previewLabel}>Design Process Steps:</Text>
              <View style={styles.processFlow}>
                {[
                  { phase: 'Discover', icon: '🔍', color: '#FF6B35' },
                  { phase: 'Define', icon: '🎯', color: '#00FF87' },
                  { phase: 'Ideate', icon: '💡', color: '#FFD700' },
                  { phase: 'Prototype', icon: '🛠️', color: '#6C63FF' },
                  { phase: 'Test', icon: '🧪', color: '#FF4757' }
                ].map((item, index) => (
                  <Animated.View 
                    key={item.phase}
                    style={[
                      styles.processStep,
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
                    <View style={[styles.processIcon, { backgroundColor: item.color }]}>
                      <Text style={styles.processEmoji}>{item.icon}</Text>
                    </View>
                    <Text style={styles.processLabel}>{item.phase}</Text>
                    {index < 4 && <View style={styles.processConnector} />}
                  </Animated.View>
                ))}
              </View>
            </View>

            {/* Research methods */}
            <View style={styles.methodsPreview}>
              <Text style={styles.methodsLabel}>Research Methods:</Text>
              <View style={styles.methodsGrid}>
                {[
                  'User Interviews', 'Surveys', 'Personas', 'Journey Maps', 
                  'Usability Testing', 'A/B Testing', 'Analytics', 'Competitive Analysis'
                ].map((method, index) => (
                  <View key={method} style={styles.methodTag}>
                    <Text style={styles.methodText}>{method}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View style={[styles.questionAccent, { backgroundColor: '#00FF87' }]} />
          </LinearGradient>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <LinearGradient
            colors={['#00FF87', '#00D9FF']}
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
            onPress={() => navigation.navigate('Interview', { careerPath: 'UIDesigner' })}
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
            colors={['rgba(0, 255, 135, 0.1)', 'rgba(0, 255, 135, 0.05)']}
            style={styles.tipsCard}
          >
            <Text style={styles.tipsTitle}>💡 Design Interview Tip</Text>
            <Text style={styles.tipsText}>
              Use the Double Diamond process (Discover, Define, Develop, Deliver). 
              Mention specific research methods like user interviews, personas, and journey mapping. 
              Show how research insights directly influence design decisions.
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
    opacity: 0.3,
  },
  designIcon: {
    fontSize: 18,
    color: '#00FF87',
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
    borderColor: 'rgba(0, 255, 135, 0.3)',
    ...SHADOWS.large,
    position: 'relative',
    overflow: 'hidden',
  },
  icon: {
    fontSize: 48,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    zIndex: 2,
  },
  gridOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'space-around',
    opacity: 0.3,
  },
  gridDot: {
    width: 2,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
    margin: 6,
  },
  title: {
    fontSize: 32,
    color: COLORS.white,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: '#00FF87',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 20,
    color: '#00FF87',
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  decorativeLine: {
    width: 80,
    height: 3,
    backgroundColor: '#00FF87',
    borderRadius: 2,
    marginBottom: 20,
  },
  toolsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  toolBadge: {
    backgroundColor: 'rgba(0, 255, 135, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 135, 0.4)',
  },
  toolText: {
    fontSize: 12,
    color: '#00FF87',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  questionContainer: {
    marginBottom: 30,
  },
  questionCard: {
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 135, 0.3)',
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
    backgroundColor: 'rgba(0, 255, 135, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00FF87',
  },
  categoryText: {
    fontSize: 10,
    color: '#00FF87',
    fontWeight: '700',
    letterSpacing: 1,
  },
  difficultyIndicator: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 10,
    color: '#000000',
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
  processPreview: {
    marginTop: 16,
    padding: 16,
    backgroundColor: 'rgba(0, 255, 135, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 135, 0.2)',
    marginBottom: 16,
  },
  previewLabel: {
    fontSize: 12,
    color: '#00FF87',
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  processFlow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  processStep: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  processIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  processEmoji: {
    fontSize: 14,
  },
  processLabel: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: '600',
    textAlign: 'center',
  },
  processConnector: {
    position: 'absolute',
    right: -10,
    top: 15,
    width: 20,
    height: 2,
    backgroundColor: 'rgba(0, 255, 135, 0.3)',
  },
  methodsPreview: {
    padding: 16,
    backgroundColor: 'rgba(0, 255, 135, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 135, 0.1)',
  },
  methodsLabel: {
    fontSize: 12,
    color: '#00FF87',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  methodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  methodTag: {
    backgroundColor: 'rgba(0, 255, 135, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  methodText: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: '500',
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
    borderColor: '#00FF87',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 135, 0.05)',
    ...SHADOWS.small,
  },
  secondaryButtonText: {
    color: '#00FF87',
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
    borderColor: 'rgba(0, 255, 135, 0.2)',
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
});