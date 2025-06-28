import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Text, Image, View, Animated, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS, gradientButtonStyle, gradientButtonInner } from '../styles';

const { width } = Dimensions.get('window');

export default function AboutScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const imageAnim = useRef(new Animated.Value(0)).current;
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
      Animated.timing(imageAnim, {
        toValue: 1,
        duration: 1000,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for the image
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
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
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={['#0A0A0A', '#1A1A1A', '#0A0A0A']} 
        style={styles.backgroundGradient}
      />
      
      {/* Floating particles */}
      {Array.from({ length: 15 }).map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              left: Math.random() * width,
              top: Math.random() * 800,
              transform: [{
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -30]
                })
              }]
            }
          ]}
        />
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
        {/* Buddy Image with Enhanced Styling */}
        <Animated.View 
          style={[
            styles.imageContainer,
            {
              opacity: imageAnim,
              transform: [
                { scale: pulseAnim },
                {
                  rotateY: imageAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg']
                  })
                }
              ]
            }
          ]}
        >
          <View style={styles.imageOuterRing} />
          <View style={styles.imageInnerRing} />
          <Image 
            source={require('../assets/Golden-Dog.png')} 
            style={styles.buddyImage}
          />
          <View style={styles.imageGlow} />
        </Animated.View>

        {/* Main Content */}
        <View style={styles.textContent}>
          <Text style={styles.title}>
            Meet <Text style={styles.titleAccent}>Buddy</Text>
          </Text>
          <Text style={styles.subtitle}>Your AI Career Coach 🐶</Text>
          
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>
              I'm here to help you ace your next interview! Together, we'll practice real questions, 
              build your confidence, and get you ready for success.
            </Text>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🎯</Text>
              <Text style={styles.featureText}>Personalized Practice</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🧠</Text>
              <Text style={styles.featureText}>AI-Powered Feedback</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>📈</Text>
              <Text style={styles.featureText}>Track Your Progress</Text>
            </View>
          </View>
        </View>

        {/* CTA Button */}
        <View style={styles.buttonContainer}>
          <LinearGradient
            colors={['#FF6B35', '#FF4757']}
            style={[gradientButtonStyle, styles.ctaButton]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <TouchableOpacity 
              style={gradientButtonInner}
              onPress={() => navigation.navigate('Questions')}
            >
              <Text style={styles.ctaButtonText}>
                🚀 Let's Get Started!
              </Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* Secondary button */}
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.secondaryButtonText}>← Back to Home</Text>
          </TouchableOpacity>
        </View>

        {/* Motivational Quote */}
        <View style={styles.quoteContainer}>
          <Text style={styles.quote}>
            "Success is where preparation and opportunity meet."
          </Text>
          <Text style={styles.quoteAuthor}>- Bobby Unser</Text>
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
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    opacity: 0.6,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageOuterRing: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 4,
    borderColor: COLORS.primary,
    opacity: 0.3,
  },
  imageInnerRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: COLORS.primary,
    opacity: 0.6,
  },
  buddyImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: COLORS.primary,
    ...SHADOWS.large,
  },
  imageGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: COLORS.primary,
    opacity: 0.1,
    ...SHADOWS.neon,
  },
  textContent: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    color: COLORS.white,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  titleAccent: {
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.lightGray,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  descriptionContainer: {
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.2)',
    marginBottom: 30,
    ...SHADOWS.small,
  },
  description: {
    fontSize: 16,
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
    letterSpacing: 0.3,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  feature: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    color: COLORS.lightGray,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  ctaButton: {
    width: '100%',
    marginBottom: 16,
  },
  ctaButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  secondaryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.3)',
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  quoteContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  quote: {
    fontSize: 16,
    color: COLORS.lightGray,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 8,
    opacity: 0.8,
    letterSpacing: 0.3,
  },
  quoteAuthor: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});