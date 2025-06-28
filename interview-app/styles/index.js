// styles/index.js
import { StyleSheet } from 'react-native';

export const COLORS = {
  primary: '#FF6B35',
  background: '#0A0A0A',
  surface: '#1A1A1A',
  white: '#FFFFFF',
  lightGray: '#B0B0B0',
  darkGray: '#333333',
  gray: '#666666',
  success: '#00FF87',
  warning: '#FFD700',
  error: '#FF4757',
  blue: '#6C63FF',
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
  neon: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 20,
  },
};

export const gradientButtonStyle = StyleSheet.create({
  button: {
    borderRadius: 12,
    overflow: 'hidden',
    ...SHADOWS.medium,
  }
}).button;

export const gradientButtonInner = StyleSheet.create({
  inner: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  }
}).inner;

export const titleStyle = StyleSheet.create({
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: COLORS.white,
    textAlign: 'center',
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  }
}).title;

export const buttonTextStyle = StyleSheet.create({
  text: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  }
}).text;