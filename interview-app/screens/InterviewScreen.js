// screens/InterviewScreen.js
import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, SHADOWS, gradientButtonStyle, gradientButtonInner } from '../styles';
import { useAuth } from '../context/AuthContext';
import { useXP } from '../context/XPContext';
import apiService from '../services/apiService';

const { width, height } = Dimensions.get('window');

// Mock questions for demo purposes
const MOCK_QUESTIONS = {
  SoftwareDev: [
    { id: 1, question: 'Can you explain the difference between REST and GraphQL APIs?', category: 'API Design', difficulty: 'intermediate' },
    { id: 2, question: 'What is the difference between synchronous and asynchronous programming?', category: 'Programming Concepts', difficulty: 'intermediate' },
    { id: 3, question: 'Explain the concept of Big O notation and its importance.', category: 'Algorithms', difficulty: 'intermediate' },
    { id: 4, question: 'What are the main principles of object-oriented programming?', category: 'Programming Concepts', difficulty: 'beginner' },
    { id: 5, question: 'How do you handle errors in your code?', category: 'Error Handling', difficulty: 'intermediate' }
  ],
  DataAnalyst: [
    { id: 1, question: 'What tools do you use for data visualization and why?', category: 'Tools', difficulty: 'beginner' },
    { id: 2, question: 'How would you handle missing data in a dataset?', category: 'Data Cleaning', difficulty: 'intermediate' },
    { id: 3, question: 'Explain the difference between correlation and causation.', category: 'Statistics', difficulty: 'intermediate' },
    { id: 4, question: 'What is the difference between mean, median, and mode?', category: 'Statistics', difficulty: 'beginner' },
    { id: 5, question: 'How do you validate the accuracy of your analysis?', category: 'Data Quality', difficulty: 'intermediate' }
  ],
  UIDesigner: [
    { id: 1, question: 'How do you approach user research for a new design project?', category: 'User Research', difficulty: 'intermediate' },
    { id: 2, question: 'What is the difference between UX and UI design?', category: 'Design Fundamentals', difficulty: 'beginner' },
    { id: 3, question: 'How do you ensure accessibility in your designs?', category: 'Accessibility', difficulty: 'intermediate' },
    { id: 4, question: 'Explain the design thinking process.', category: 'Design Process', difficulty: 'intermediate' },
    { id: 5, question: 'What are design systems and why are they important?', category: 'Design Systems', difficulty: 'intermediate' }
  ],
  DigitalMarketer: [
    { id: 1, question: 'Explain how you would run a successful paid advertising campaign.', category: 'Paid Advertising', difficulty: 'intermediate' },
    { id: 2, question: 'What metrics do you track for email marketing campaigns?', category: 'Email Marketing', difficulty: 'intermediate' },
    { id: 3, question: 'How do you measure the ROI of social media marketing?', category: 'Social Media', difficulty: 'intermediate' },
    { id: 4, question: 'Explain the concept of marketing funnel.', category: 'Marketing Strategy', difficulty: 'beginner' },
    { id: 5, question: 'What is SEO and how do you optimize for it?', category: 'SEO', difficulty: 'intermediate' }
  ]
};

// Main component - using default export
export default function InterviewScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { careerPath } = route.params || {};
  const { user } = useAuth();
  const { addXP, addGuestXP } = useXP();

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [currentResponse, setCurrentResponse] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    initializeInterview();
  }, []);

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

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (currentQuestionIndex / questions.length) || 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentQuestionIndex, questions.length]);

  const initializeInterview = async () => {
    if (!careerPath) {
      Alert.alert('Error', 'No career path selected. Please go back and select one.');
      navigation.goBack();
      return;
    }

    try {
      // Use mock questions for demo
      const careerQuestions = MOCK_QUESTIONS[careerPath] || MOCK_QUESTIONS.SoftwareDev;
      setQuestions(careerQuestions);

      // Start interview session via API (works for both authenticated and guest users)
      try {
        const userId = user ? user.uid : 'guest';
        const sessionResponse = await apiService.startInterview(userId, careerPath);
        setSessionId(sessionResponse.session_id);
        console.log('Interview session started:', sessionResponse.session_id);
      } catch (error) {
        console.error('Failed to start interview session:', error);
        // Continue with local-only interview
      }

      setStartTime(new Date());
      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing interview:', error);
      Alert.alert('Error', 'Failed to initialize interview. Please try again.');
      navigation.goBack();
    }
  };

  const handleSubmitResponse = async () => {
    if (!currentResponse.trim()) {
      Alert.alert('Error', 'Please provide an answer before proceeding.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const currentQuestion = questions[currentQuestionIndex];
      
      // Save response locally
      const newResponse = {
        questionId: currentQuestion.id,
        questionText: currentQuestion.question,
        response: currentResponse.trim(),
        category: currentQuestion.category,
        difficulty: currentQuestion.difficulty,
        timestamp: new Date().toISOString()
      };
      
      const updatedResponses = [...responses, newResponse];
      setResponses(updatedResponses);

      // Submit to API if session exists
      if (sessionId) {
        try {
          await apiService.submitResponse(
            sessionId,
            currentQuestion.id,
            currentQuestion.question,
            currentResponse.trim(),
            currentQuestion.category,
            currentQuestion.difficulty
          );
        } catch (error) {
          console.error('Failed to submit response to API:', error);
        }
      }

      // Check if this was the last question
      if (currentQuestionIndex === questions.length - 1) {
        await completeInterview(updatedResponses);
      } else {
        // Move to next question
        setCurrentQuestionIndex(prev => prev + 1);
        setCurrentResponse('');
      }
    } catch (error) {
      console.error('Error submitting response:', error);
      Alert.alert('Error', 'Failed to submit response. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const completeInterview = async (finalResponses) => {
    try {
      // End session via API if it exists
      if (sessionId) {
        try {
          const endResponse = await apiService.endInterview(sessionId);
          console.log('Interview session completed:', endResponse);
          
          // Award XP
          const xpEarned = endResponse.xp_earned || 75;
          if (user) {
            // Authenticated user - XP handled by backend
            console.log(`XP awarded to user: ${xpEarned}`);
          } else {
            // Guest user - add to guest XP
            await addGuestXP(xpEarned);
            console.log(`Guest XP added: ${xpEarned}`);
          }
        } catch (error) {
          console.error('Failed to end interview session:', error);
          // For guests, still award local XP
          if (!user) {
            await addGuestXP(75);
          }
        }
      }

      const endTime = new Date();
      const duration = Math.round((endTime - startTime) / 1000 / 60); // in minutes

      Alert.alert(
        'Interview Complete!',
        `You have completed all questions in ${duration} minutes. Great job!`,
        [
          {
            text: 'View Results',
            onPress: () => navigation.navigate('InterviewResults', {
              careerPath,
              responses: finalResponses,
              questions,
              sessionId,
              duration
            }),
          },
        ]
      );
    } catch (error) {
      console.error('Error completing interview:', error);
      Alert.alert('Error', 'There was an issue completing the interview.');
    }
  };

  const handleSkipQuestion = () => {
    Alert.alert(
      'Skip Question',
      'Are you sure you want to skip this question? You won\'t be able to come back to it.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Skip', 
          style: 'destructive',
          onPress: () => {
            if (currentQuestionIndex === questions.length - 1) {
              completeInterview(responses);
            } else {
              setCurrentQuestionIndex(prev => prev + 1);
              setCurrentResponse('');
            }
          }
        }
      ]
    );
  };

  const handleEndInterview = () => {
    Alert.alert(
      'End Interview',
      'Are you sure you want to end the interview? Your progress will be saved.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'End Interview', 
          style: 'destructive',
          onPress: () => completeInterview(responses)
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient 
          colors={['#0A0A0A', '#1A1A1A', '#0A0A0A']} 
          style={styles.backgroundGradient}
        />
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading interview questions...</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex] || {};
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient 
        colors={['#0A0A0A', '#1A1A1A', '#0A0A0A']} 
        style={styles.backgroundGradient}
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
            <Text style={styles.careerTitle}>{careerPath} Interview</Text>
            <Text style={styles.questionCounter}>
              Question {currentQuestionIndex + 1} of {questions.length}
            </Text>
            
            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <Animated.View 
                  style={[
                    styles.progressFill,
                    {
                      width: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%']
                      })
                    }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>{Math.round(progress)}% Complete</Text>
            </View>
          </View>

          {/* Question Card */}
          <View style={styles.questionCard}>
            <LinearGradient
              colors={['rgba(255, 107, 53, 0.1)', 'rgba(255, 107, 53, 0.05)']}
              style={styles.questionGradient}
            >
              <View style={styles.questionHeader}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{currentQuestion.category}</Text>
                </View>
                <View style={[
                  styles.difficultyBadge,
                  { backgroundColor: currentQuestion.difficulty === 'beginner' ? COLORS.success : 
                    currentQuestion.difficulty === 'intermediate' ? COLORS.warning : COLORS.error }
                ]}>
                  <Text style={styles.difficultyText}>{currentQuestion.difficulty?.toUpperCase()}</Text>
                </View>
              </View>
              
              <Text style={styles.questionText}>{currentQuestion.question}</Text>
            </LinearGradient>
          </View>

          {/* Response Input */}
          <View style={styles.responseContainer}>
            <Text style={styles.responseLabel}>Your Answer:</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.responseInput}
                multiline
                numberOfLines={6}
                value={currentResponse}
                onChangeText={setCurrentResponse}
                placeholder="Type your answer here..."
                placeholderTextColor={COLORS.gray}
                textAlignVertical="top"
              />
            </View>
            <Text style={styles.characterCount}>
              {currentResponse.length} characters
            </Text>
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
                style={[gradientButtonInner, { opacity: isSubmitting ? 0.7 : 1 }]}
                onPress={handleSubmitResponse}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <Text style={styles.submitButtonText}>
                    {currentQuestionIndex === questions.length - 1 ? 'Complete Interview' : 'Next Question'} →
                  </Text>
                )}
              </TouchableOpacity>
            </LinearGradient>

            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkipQuestion}
            >
              <Text style={styles.skipButtonText}>Skip Question</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.endButton}
              onPress={handleEndInterview}
            >
              <Text style={styles.endButtonText}>End Interview</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    flexGrow: 1,
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
  careerTitle: {
    fontSize: 28,
    color: COLORS.white,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  questionCounter: {
    fontSize: 16,
    color: COLORS.lightGray,
    marginBottom: 20,
    fontWeight: '500',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.darkGray,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
    textAlign: 'right',
  },
  questionCard: {
    marginBottom: 30,
  },
  questionGradient: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.2)',
    ...SHADOWS.large,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: '700',
  },
  questionText: {
    fontSize: 20,
    color: COLORS.white,
    lineHeight: 30,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  responseContainer: {
    marginBottom: 30,
  },
  responseLabel: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '600',
    marginBottom: 12,
  },
  inputWrapper: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.darkGray,
    ...SHADOWS.small,
  },
  responseInput: {
    color: COLORS.white,
    fontSize: 16,
    padding: 20,
    minHeight: 150,
    fontWeight: '400',
    lineHeight: 24,
  },
  characterCount: {
    fontSize: 12,
    color: COLORS.lightGray,
    textAlign: 'right',
    marginTop: 8,
    opacity: 0.8,
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
  },
  skipButton: {
    borderWidth: 2,
    borderColor: COLORS.warning,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
    ...SHADOWS.small,
  },
  skipButtonText: {
    color: COLORS.warning,
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
});