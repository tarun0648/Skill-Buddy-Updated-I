import React, { useState, useRef, useEffect } from 'react';
import { TouchableOpacity, Text, View, Animated, Dimensions, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, titleStyle, gradientButtonStyle, gradientButtonInner, buttonTextStyle, SHADOWS } from '../styles';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = 220;

const carouselItems = [
  {
    id: 1,
    title: 'Practice Interviews',
    description: 'Get ready for your dream job with realistic mock interviews powered by AI',
    gradient: ['#FF6B35', '#FF4757'],
    icon: '💼',
    accentColor: '#00FF87'
  },
  {
    id: 2,
    title: 'Multiple Careers',
    description: 'Choose from Software Dev, Data Analyst, UI/UX, and Marketing career paths',
    gradient: ['#6C63FF', '#9F7AEA'],
    icon: '🎯',
    accentColor: '#FFD700'
  },
  {
    id: 3,
    title: 'Earn XP & Rewards',
    description: 'Complete interviews to earn experience points and unlock achievements',
    gradient: ['#00FF87', '#00D9FF'],
    icon: '🏆',
    accentColor: '#FF6B35'
  },
  {
    id: 4,
    title: 'Track Progress',
    description: 'Monitor your improvement and build confidence over time with detailed analytics',
    gradient: ['#FFD700', '#FF8C42'],
    icon: '📈',
    accentColor: '#00FF87'
  }
];

export default function IntroScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const rotationValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;
  const floatingValues = useRef(carouselItems.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Auto-rotate carousel
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % carouselItems.length);
    }, 4000);

    // Continuous rotation animation
    Animated.loop(
      Animated.timing(rotationValue, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();

    // Pulse animation for main title
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Floating animations for cards
    floatingValues.forEach((animValue, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: 3000 + (index * 500),
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 3000 + (index * 500),
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    return () => clearInterval(interval);
  }, []);

  const renderParticles = () => {
    return Array.from({ length: 20 }).map((_, index) => (
      <Animated.View
        key={index}
        style={[
          styles.particle,
          {
            left: Math.random() * width,
            top: Math.random() * height,
            transform: [{
              translateY: rotationValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -50]
              })
            }]
          }
        ]}
      />
    ));
  };

  const renderCarouselItem = (item, index) => {
    const isActive = index === currentIndex;
    const translateX = (index - currentIndex) * (CARD_WIDTH * 0.9);
    const scale = isActive ? 1 : 0.85;
    const opacity = isActive ? 1 : 0.7;
    const rotation = isActive ? '2deg' : '0deg';

    return (
      <Animated.View
        key={item.id}
        style={[
          styles.carouselCard,
          {
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            transform: [
              { translateX },
              { scale },
              { rotateZ: rotation },
              { 
                translateY: floatingValues[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -10]
                })
              }
            ],
            opacity,
            zIndex: isActive ? 10 : 1,
          }
        ]}
      >
        <LinearGradient
          colors={item.gradient}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Accent border */}
          <View style={[styles.accentBorder, { borderColor: item.accentColor }]} />
          
          {/* Icon with glow effect */}
          <View style={styles.iconContainer}>
            <Text style={[styles.cardIcon, { textShadowColor: item.accentColor }]}>
              {item.icon}
            </Text>
          </View>
          
          {/* Content */}
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>
          
          {/* Decorative elements */}
          <View style={[styles.decorativeCircle, { backgroundColor: item.accentColor }]} />
        </LinearGradient>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={['#0A0A0A', '#1A1A1A', '#0A0A0A']} 
        style={styles.backgroundGradient}
      />
      
      {/* Animated particles */}
      {renderParticles()}
      
      {/* Main content */}
      <View style={styles.content}>
        {/* Animated title */}
        <Animated.View style={{ transform: [{ scale: pulseValue }] }}>
          <Text style={[titleStyle, styles.mainTitle]}>
            Skill<Text style={styles.titleAccent}>buddy</Text>
          </Text>
        </Animated.View>
        
        <Text style={styles.subtitle}>
          Your AI-powered career coach
        </Text>
        
        {/* 3D Carousel */}
        <View style={styles.carouselContainer}>
          {carouselItems.map((item, index) => renderCarouselItem(item, index))}
        </View>

        {/* Enhanced Carousel Indicators */}
        <View style={styles.indicatorContainer}>
          {carouselItems.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setCurrentIndex(index)}
              style={[
                styles.indicator,
                {
                  backgroundColor: currentIndex === index ? COLORS.primary : COLORS.darkGray,
                  width: currentIndex === index ? 24 : 8,
                  ...SHADOWS.small
                }
              ]}
            />
          ))}
        </View>
        
        {/* Enhanced CTA Button */}
        <View style={styles.ctaContainer}>
          <LinearGradient
            colors={['#FF6B35', '#FF4757']}
            style={[gradientButtonStyle, styles.ctaButton]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <TouchableOpacity 
              style={gradientButtonInner}
              onPress={() => navigation.navigate('About')}
            >
              <Text style={[buttonTextStyle, styles.ctaText]}>
                🚀 Get Started
              </Text>
            </TouchableOpacity>
          </LinearGradient>
          
          {/* Pulsing ring around button */}
          <Animated.View 
            style={[
              styles.pulsingRing,
              {
                transform: [{ scale: pulseValue }],
                opacity: pulseValue.interpolate({
                  inputRange: [1, 1.05],
                  outputRange: [0.3, 0]
                })
              }
            ]} 
          />
        </View>
      </View>
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
    width: 3,
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: 1.5,
    opacity: 0.6,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  mainTitle: {
    fontSize: 42,
    fontWeight: '900',
    marginBottom: 10,
    textAlign: 'center',
  },
  titleAccent: {
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.lightGray,
    textAlign: 'center',
    marginBottom: 50,
    fontWeight: '300',
    letterSpacing: 1,
    opacity: 0.9,
  },
  carouselContainer: {
    height: CARD_HEIGHT + 40,
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    overflow: 'visible'
  },
  carouselCard: {
    position: 'absolute',
  },
  cardGradient: {
    flex: 1,
    borderRadius: 20,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    ...SHADOWS.large,
  },
  accentBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    borderWidth: 2,
    borderTopWidth: 4,
  },
  iconContainer: {
    marginBottom: 16,
    padding: 8,
  },
  cardIcon: {
    fontSize: 48,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  cardTitle: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.95,
    lineHeight: 20,
    fontWeight: '400',
    letterSpacing: 0.3,
  },
  decorativeCircle: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 12,
    height: 12,
    borderRadius: 6,
    opacity: 0.8,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
    gap: 12,
  },
  indicator: {
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.darkGray,
  },
  ctaContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  ctaButton: {
    width: width * 0.8,
    maxWidth: 300,
  },
  ctaText: {
    fontSize: 18,
    letterSpacing: 1,
  },
  pulsingRing: {
    position: 'absolute',
    width: width * 0.8 + 20,
    height: 70,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
});