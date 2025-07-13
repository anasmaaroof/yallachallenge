// constants/theme.js
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

// لوحة الألوان الموحدة التي كانت تعمل بدون مشاكل
export const COLORS = {
  primary: '#14B8A6',     // Teal
  secondary: '#F97316',   // Orange
  background: '#F0FDFA',  // Mint Cream
  surface: '#FFFFFF',     // White
  text: '#1E293B',        // Slate Gray
  subtleText: '#64748B',  // Light Slate
  button: '#FFFFFF',
};

export const SIZES = {
  // global sizes
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,

  // font sizes
  h1: 30,
  h2: 22,
  h3: 16,
  body: 14,
  button: 16,

  // app dimensions
  width,
  height,
};

export const FONTS = {
  h1: { fontFamily: 'System', fontSize: SIZES.h1, lineHeight: 36, color: COLORS.text },
  h2: { fontFamily: 'System', fontSize: SIZES.h2, lineHeight: 30, color: COLORS.text },
  h3: { fontFamily: 'System', fontSize: SIZES.h3, lineHeight: 22, color: COLORS.text },
  body: { fontFamily: 'System', fontSize: SIZES.body, lineHeight: 22, color: COLORS.text },
  button: { fontFamily: 'System', fontSize: SIZES.button, fontWeight: 'bold', color: COLORS.button, letterSpacing: 1 },
};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;