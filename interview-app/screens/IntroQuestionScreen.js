// screens/IntroQuestionScreen.js
import React, { useRef, useEffect, useState } from 'react';
import { TouchableOpacity, Text, View, Animated, StyleSheet, Dimensions, PanResponder, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS, gradientButtonStyle, gradientButtonInner } from '../styles';

const { width, height } = Dimensions.get('window');

const careerPaths = [
  {
    id: 'SoftwareDev',
    title: 'Software Developer',
    description: 'Build amazing applications and systems',
    icon: '💻',
    gradient: ['#FF6B35', '#FF4757'],
    skills: ['React', 'Node.js', 'Python', 'SQL']
  },
  {
    id: 'DataAnalyst',
    title: 'Data Analyst',
    description: 'Turn data into actionable insights',
    icon: '📊',
    gradient: ['#6C63FF', '#9F7AEA'],
    skills: ['Python', 'SQL', 'Tableau', 'Statistics']
  },
  {
    id: 'UIDesigner',
    title: 'UI/UX Designer',
    description: 'Create beautiful user experiences',
    icon: '🎨',
    gradient: ['#00FF87', '#00D9FF'],
    skills: ['Figma', 'Sketch', 'Prototyping', 'User Research']
  },
  {
    id: 'DigitalMarketer',
    title: 'Digital Marketer',
    description: 'Drive growth through digital channels',
    icon: '📈',
    gradient: ['#FFD700', '#FF8C42'],
    skills: ['SEO', 'PPC', 'Analytics', 'Content Strategy']
  }
];

export default function IntroQuestionScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const cardAnims = useRef(careerPaths.map(() => new Animated.Value(0))).current;

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

    // Stagger card animations
    const cardAnimations = cardAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 600,
        delay: index * 150,
        useNativeDriver: true,
      })
    );

    Animated.parallel(cardAnimations).start();

    // Pulse animation for swipe indicator
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
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

  const handleCareerSelection = (careerPath) => {
    navigation.navigate('Interview', { careerPath });
  };

  const CareerCard = ({ career, index }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View
        style={[
          styles.cardContainer,
          {
            opacity: cardAnims[index],
            transform: [
              { scale: scaleAnim },
              {
                translateY: cardAnims[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0]
                })
              }
            ]
          }
        ]}
      >
        <LinearGradient
          colors={career.gradient}
          style={styles.careerCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <TouchableOpacity
            style={styles.cardTouchable}
            onPress={() => handleCareerSelection(career.id)}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.9}
          >
            {/* Icon */}
            <View style={styles.iconContainer}>
              <Text style={styles.careerIcon}>{career.icon}</Text>
            </View>

            {/* Content */}
            <View style={styles.cardContent}>
              <Text style={styles.careerTitle} numberOfLines={2}>
                {career.title || 'Career Title'}
              </Text>
              <Text style={styles.careerDescription} numberOfLines={3}>
                {career.description || 'Career description'}
              </Text>
              
              {/* Skills */}
              <View style={styles.skillsContainer}>
                {(career.skills || ['Skill1', 'Skill2']).map((skill, skillIndex) => (
                  <View key={skillIndex} style={styles.skillTag}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Arrow */}
            <View style={styles.arrowContainer}>
              <Text style={styles.arrow}>→</Text>
            </View>

            {/* Decorative elements */}
            <View style={styles.decorativeCircle1} />
            <View style={styles.decorativeCircle2} />
          </TouchableOpacity>
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
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={scrollEnabled}
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
            <Text style={styles.title}>Choose Your Career Path</Text>
            <Text style={styles.subtitle}>
              Select the role you want to practice for
            </Text>
            <View style={styles.decorativeLine} />
          </View>

          {/* Career Cards */}
          <View style={styles.cardsContainer}>
            {careerPaths.map((career, index) => (
              <CareerCard key={career.id} career={career} index={index} />
            ))}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              💡 Each path includes role-specific questions designed by industry experts
            </Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
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
    marginBottom: 12,
    textAlign: 'center',
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.lightGray,
    opacity: 0.9,
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  decorativeLine: {
    width: 60,
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  cardsContainer: {
    gap: 20,
    marginBottom: 30,
  },
  cardContainer: {
    marginBottom: 20,
  },
  careerCard: {
    borderRadius: 20,
    ...SHADOWS.large,
    overflow: 'hidden',
    minHeight: 220,
  },
  cardTouchable: {
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    minHeight: 180,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  careerIcon: {
    fontSize: 32,
  },
  cardContent: {
    flex: 1,
    paddingRight: 10,
  },
  careerTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  careerDescription: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 16,
    lineHeight: 22,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  skillText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  arrowContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  arrow: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  decorativeCircle1: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.lightGray,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 20,
    letterSpacing: 0.3,
  },
});