// screens/HomeScreen.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

// استيراد الثيم المركزي
import { COLORS, FONTS, SIZES } from '../constants/theme';
// --- 1. استيراد نظام الصوت ---
import { useSound } from '../contexts/SoundContext';

const HomeScreen = ({ navigation }) => {
  // --- 2. الحصول على دالة تشغيل الصوت ---
  const { playSound } = useSound();

  // --- 3. إنشاء دوال للضغط على الأزرار ---
  const handleSettingsPress = () => {
    playSound('click');
    navigation.navigate('Settings');
  };

  const handleStartPress = () => {
    playSound('click');
    navigation.navigate('PlayerInput');
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* --- زر الإعدادات --- */}
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={handleSettingsPress} // <-- استخدام الدالة الجديدة
      >
        <Text style={styles.settingsIcon}>⚙️</Text>
      </TouchableOpacity>

      {/* --- المحتوى الرئيسي للشاشة --- */}
      <View style={styles.mainContent}>
        {/* قسم العنوان */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>وقت المتعة!</Text>
          <Text style={styles.subtitle}>تحديات وأسئلة جماعية</Text>
        </View>

        {/* قسم زر البدء */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartPress} // <-- استخدام الدالة الجديدة
        >
          <Text style={styles.buttonText}>ابدأ اللعبة</Text>
        </TouchableOpacity>
      </View>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  settingsButton: {
    position: 'absolute',
    top: 50,
    right: SIZES.padding,
    zIndex: 1,
    padding: SIZES.base,
  },
  settingsIcon: {
    fontSize: SIZES.h1,
    color: COLORS.text,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: SIZES.padding * 3,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.primary,
    textAlign: 'center',
  },
  subtitle: {
    ...FONTS.body,
    color: COLORS.subtleText,
    textAlign: 'center',
    marginTop: SIZES.base,
  },
  startButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: SIZES.radius * 2,
    width: '80%',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  buttonText: {
    ...FONTS.button,
  },
});

export default HomeScreen;