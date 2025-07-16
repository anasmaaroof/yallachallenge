import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

// لوحة ألوان موسعة وديناميكية تدعم جميع أنواع الألعاب والثيمات
export const COLORS = {
  // الألوان الأساسية
  primary: '#14B8A6',     // Teal
  secondary: '#F97316',   // Orange
  background: '#F0FDFA',  // Mint Cream
  surface: '#FFFFFF',     // White
  text: '#1E293B',        // Slate Gray
  subtleText: '#64748B',  // Light Slate
  button: '#FFFFFF',

  // ألوان إضافية للنجاح، الفشل، التحذير، المعلومات، إلخ
  success: '#22C55E',     // Emerald
  fail: '#EF4444',        // Red
  warning: '#FACC15',     // Yellow
  info: '#3B82F6',        // Blue
  border: '#E5E7EB',      // Light border

  // ألوان ديناميكية لبعض الثيمات الخاصة
  primaryLight: '#A7F3D0', // Light Teal
  secondaryLight: '#FFDABF', // Light Orange
  onPrimary: '#FFFFFF',      // نص فوق الأزرار الأساسية
  onSuccess: '#FFFFFF',
  buttonText: '#FFFFFF',
  buttonTextDark: '#1E293B',

  // ثيم مخصص للتمثيل الصامت أو الألعاب الجماعية
  charades: {
    background: '#E8F6EF',
    text: '#222831',
    primary: '#00ADB5',
    primaryLight: '#B2F7EF',
    secondary: '#FFD369',
    surface: '#FAFAFA',
    subtleText: '#393E46',
    success: '#00C48C',
    fail: '#FF3B30',
    border: '#B2F7EF',
    buttonText: '#222831',
    buttonTextDark: '#FFFFFF',
    onPrimary: '#FFFFFF',
    onSuccess: '#FFFFFF',
  }
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
  h1: { fontFamily: 'System', fontSize: SIZES.h1, lineHeight: 36, color: COLORS.text, fontWeight: 'bold' },
  h2: { fontFamily: 'System', fontSize: SIZES.h2, lineHeight: 30, color: COLORS.text, fontWeight: 'bold' },
  h3: { fontFamily: 'System', fontSize: SIZES.h3, lineHeight: 22, color: COLORS.text },
  body: { fontFamily: 'System', fontSize: SIZES.body, lineHeight: 22, color: COLORS.text },
  button: { fontFamily: 'System', fontSize: SIZES.button, fontWeight: 'bold', color: COLORS.buttonText, letterSpacing: 1 },
};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;