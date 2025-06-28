import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SHADOWS, gradientButtonStyle, gradientButtonInner } from '../styles';

const { width } = Dimensions.get('window');

export default function DataAnalystScreen() {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

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

    // Floating animation for decorative elements
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
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={['#0A0A0A', '#1A1A1A', '#0A0A0A']} 
        style={styles.backgroundGradient}
      />
      
      {/* Floating data visualization elements */}
      {Array.from({ length: 12 }).map((_, index) => (
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
              }]
            }
          ]}
        >
          <Text style={styles.dataIcon}>
            {['📊', '📈', '📉', '💹', '🔢', '📋'][Math.floor(Math.random() * 6)]}
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
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <LinearGradient
              colors={['#6C63FF', '#9F7AEA']}
              style={styles.iconContainer}
            >
              <Text style={styles.icon}>📊</Text>
            </LinearGradient>
          </Animated.View>
          <Text style={styles.title}>Mock Interview</Text>
          <Text style={styles.subtitle}>Data Analyst</Text>
          <View style={styles.decorativeLine} />
          
          {/* Skills badges */}
          <View style={styles.skillsContainer}>
            {['Python', 'SQL', 'Tableau', 'Excel'].map((skill, index) => (
              <Animated.View
                key={skill}
                style={[
                  styles.skillBadge,
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
                <Text style={styles.skillText}>{skill}</Text>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Enhanced Question Card */}
        <View style={styles.questionContainer}>
          <LinearGradient
            colors={['rgba(108, 99, 255, 0.15)', 'rgba(159, 122, 234, 0.05)']}
            style={styles.questionCard}
          >
            <View style={styles.questionHeader}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>TOOLS & TECHNIQUES</Text>
              </View>
              <View style={styles.difficultyIndicator}>
                <Text style={styles.difficultyText}>MEDIUM</Text>
              </View>
            </View>
            
            <Text style={styles.question}>
              What tools do you use for data visualization and why? Explain how you would choose between different visualization types.
            </Text>
            
            {/* Data visualization preview */}
            <View style={styles.visualPreview}>
              <Text style={styles.previewLabel}>Expected topics:</Text>
              <View style={styles.topicsContainer}>
                {['Charts & Graphs', 'Dashboard Design', 'Data Storytelling', 'Tool Selection'].map((topic, index) => (
                  <View key={topic} style={styles.topicTag}>
                    <Text style={styles.topicText}>{topic}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View style={[styles.questionAccent, { backgroundColor: '#6C63FF' }]} />
          </LinearGradient>
        </View>

        {/* Action Buttons */}
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
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Interview', { careerPath: 'DataAnalyst' })}
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
            colors={['rgba(108, 99, 255, 0.1)', 'rgba(108, 99, 255, 0.05)']}
            style={styles.tipsCard}
          >
            <Text style={styles.tipsTitle}>💡 Interview Tip</Text>
            <Text style={styles.tipsText}>
              Mention specific tools like Tableau, Power BI, or Python libraries (matplotlib, seaborn). 
              Explain your decision-making process for choosing visualization types.
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
  dataIcon: {
    fontSize: 20,
    color: '#6C63FF',
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
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: 'rgba(108, 99, 255, 0.3)',
    ...SHADOWS.large,
  },
  icon: {
    fontSize: 48,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  title: {
    fontSize: 32,
    color: COLORS.white,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: '#6C63FF',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 20,
    color: '#6C63FF',
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  decorativeLine: {
    width: 80,
    height: 3,
    backgroundColor: '#6C63FF',
    borderRadius: 2,
    marginBottom: 20,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  skillBadge: {
    backgroundColor: 'rgba(108, 99, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.4)',
  },
  skillText: {
    fontSize: 12,
    color: '#6C63FF',
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
    borderColor: 'rgba(108, 99, 255, 0.3)',
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
    backgroundColor: 'rgba(108, 99, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#6C63FF',
  },
  categoryText: {
    fontSize: 10,
    color: '#6C63FF',
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
  visualPreview: {
    marginTop: 16,
    padding: 16,
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.2)',
  },
  previewLabel: {
    fontSize: 12,
    color: '#6C63FF',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  topicTag: {
    backgroundColor: 'rgba(108, 99, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  topicText: {
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
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: '#6C63FF',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    backgroundColor: 'rgba(108, 99, 255, 0.05)',
    ...SHADOWS.small,
  },
  secondaryButtonText: {
    color: '#6C63FF',
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
    borderColor: 'rgba(108, 99, 255, 0.2)',
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