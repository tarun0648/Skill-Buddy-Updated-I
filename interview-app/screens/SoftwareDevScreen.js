// Updated SoftwareDevScreen.js
import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SHADOWS, gradientButtonStyle, gradientButtonInner } from '../styles';

export default function SoftwareDevScreen() {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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
        <View style={styles.header}>
          <Text style={styles.icon}>📊</Text>
          <Text style={styles.title}>Mock Interview</Text>
          <Text style={styles.subtitle}>Data Analyst</Text>
        </View>

        <View style={styles.questionContainer}>
          <LinearGradient
            colors={['rgba(108, 99, 255, 0.1)', 'rgba(108, 99, 255, 0.05)']}
            style={styles.questionCard}
          >
            <Text style={styles.questionLabel}>Tools & Techniques</Text>
            <Text style={styles.question}>
              What tools do you use for data visualization and why?
            </Text>
            <View style={[styles.questionAccent, { backgroundColor: '#6C63FF' }]} />
          </LinearGradient>
        </View>

        <View style={styles.buttonContainer}>
          <LinearGradient
            colors={['#6C63FF', '#9F7AEA']}
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
            style={styles.endButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.endButtonText}>⏹️ End Interview</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

// Updated UIDesignerScreen.js
export function UIDesignerScreen() {
  const navigation = useNavigation();
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
        <View style={styles.header}>
          <Text style={styles.icon}>🎨</Text>
          <Text style={styles.title}>Mock Interview</Text>
          <Text style={styles.subtitle}>UI/UX Designer</Text>
        </View>

        <View style={styles.questionContainer}>
          <LinearGradient
            colors={['rgba(0, 255, 135, 0.1)', 'rgba(0, 255, 135, 0.05)']}
            style={styles.questionCard}
          >
            <Text style={styles.questionLabel}>Design Process</Text>
            <Text style={styles.question}>
              How do you approach user research for a new design project?
            </Text>
            <View style={[styles.questionAccent, { backgroundColor: '#00FF87' }]} />
          </LinearGradient>
        </View>

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
            style={styles.endButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.endButtonText}>⏹️ End Interview</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

// Updated DigitalMarketerScreen.js
export function DigitalMarketerScreen() {
  const navigation = useNavigation();
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
        <View style={styles.header}>
          <Text style={styles.icon}>📈</Text>
          <Text style={styles.title}>Mock Interview</Text>
          <Text style={styles.subtitle}>Digital Marketer</Text>
        </View>

        <View style={styles.questionContainer}>
          <LinearGradient
            colors={['rgba(255, 215, 0, 0.1)', 'rgba(255, 215, 0, 0.05)']}
            style={styles.questionCard}
          >
            <Text style={styles.questionLabel}>Campaign Strategy</Text>
            <Text style={styles.question}>
              Explain how you would run a successful paid advertising campaign.
            </Text>
            <View style={[styles.questionAccent, { backgroundColor: '#FFD700' }]} />
          </LinearGradient>
        </View>

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
            style={styles.endButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.endButtonText}>⏹️ End Interview</Text>
          </TouchableOpacity>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  icon: {
    fontSize: 64,
    marginBottom: 20,
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },
  title: {
    fontSize: 32,
    color: COLORS.white,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  questionContainer: {
    marginBottom: 40,
  },
  questionCard: {
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.3)',
    ...SHADOWS.large,
    position: 'relative',
    overflow: 'hidden',
  },
  questionLabel: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '700',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  question: {
    fontSize: 20,
    color: COLORS.white,
    lineHeight: 32,
    fontWeight: '500',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  questionAccent: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 6,
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  buttonContainer: {
    gap: 20,
    paddingHorizontal: 20,
  },
  actionButton: {
    width: '100%',
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
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
});