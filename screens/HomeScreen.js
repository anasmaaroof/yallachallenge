import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useSound } from '../contexts/SoundContext';

// أيقونات مرحة للصفحة
const gameIcon = require('../assets/game_icon.png'); // ضع أيقونة مرحة في assets
const partyIcon = require('../assets/party_icon.png'); // أيقونة حفلة في assets

const HomeScreen = ({ navigation }) => {
  const { playSound } = useSound();

  const handleSettingsPress = () => {
    playSound('click');
    navigation.navigate('Settings');
  };

  const handleStartPress = () => {
    playSound('start');
    navigation.navigate('PlayerInput');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* زر الإعدادات في الأعلى */}
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={handleSettingsPress}
        activeOpacity={0.7}
        accessibilityLabel="الإعدادات"
      >
        <Text style={styles.settingsIcon}>⚙️</Text>
      </TouchableOpacity>

      {/* محتوى الصفحة الرئيسي */}
      <View style={styles.mainContent}>
        {/* أيقونة مرحة أعلى العنوان */}
        <Image source={gameIcon} style={styles.gameIcon} />
        <View style={styles.headerContainer}>
          <Text style={styles.appName}>وقت المتعة</Text>
          <Text style={styles.developedBy}>Developed by: anas maaroof</Text>
          <Text style={styles.title}>تحديات وأسئلة جماعية <Text style={{ fontSize: 24 }}>🎉</Text></Text>
        </View>
        {/* وصف قصير للعبة */}
        <Text style={styles.description}>
          استمتع مع أصدقائك مع لعبة {`"وقت المتعة"`} - جولات، تحديات، عقوبات، أسئلة جماعية والكثير من الضحك والحماس!
        </Text>
        {/* زر البدء */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartPress}
          activeOpacity={0.85}
          accessibilityLabel="ابدأ اللعبة الآن"
        >
          <Text style={styles.buttonText}>ابدأ اللعبة الآن</Text>
        </TouchableOpacity>
        {/* أيقونة حفلة أسفل الزر */}
        <Image source={partyIcon} style={styles.partyIcon} />
      </View>
      {/* تذييل بسيط */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 - فريق المرح • صُممت بحب لـ وقت المتعة</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    position: 'relative',
  },
  settingsButton: {
    position: 'absolute',
    top: 45,
    right: SIZES.padding,
    zIndex: 2,
    padding: SIZES.base,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  settingsIcon: {
    fontSize: SIZES.h1 + 10,
    color: COLORS.primary,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
    marginTop: SIZES.h2,
  },
  gameIcon: {
    width: 95,
    height: 95,
    borderRadius: 28,
    marginBottom: SIZES.base * 2,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.19,
    shadowRadius: 11,
    elevation: 8,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: SIZES.padding * 2,
  },
  appName: {
    ...FONTS.h1,
    color: COLORS.primary,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: SIZES.h1 * 1.1,
    letterSpacing: 2,
    marginBottom: 2,
    textShadowColor: COLORS.primaryLight,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  developedBy: {
    ...FONTS.body,
    color: COLORS.subtleText,
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 6,
    opacity: 0.9,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.secondary,
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: SIZES.base / 1.2,
    fontSize: SIZES.h2 * 1.05,
  },
  subtitle: {
    ...FONTS.body,
    color: COLORS.subtleText,
    textAlign: 'center',
    marginTop: SIZES.base,
    fontSize: SIZES.h3,
    letterSpacing: 1,
  },
  description: {
    ...FONTS.body,
    color: COLORS.text,
    textAlign: 'center',
    fontSize: SIZES.h3,
    marginBottom: SIZES.base * 2,
    marginTop: SIZES.base,
    width: '96%',
    lineHeight: SIZES.h3 * 1.5,
    opacity: 0.92,
  },
  startButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: SIZES.radius * 2.5,
    width: '82%',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.30,
    shadowRadius: 10,
    elevation: 12,
    marginTop: SIZES.base * 2,
    marginBottom: SIZES.base * 2,
  },
  buttonText: {
    ...FONTS.button,
    color: COLORS.onPrimary,
    fontWeight: 'bold',
    fontSize: SIZES.h2,
    letterSpacing: 1.2,
  },
  partyIcon: {
    width: 58,
    height: 58,
    marginTop: SIZES.base * 3,
    opacity: 0.92,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  footerText: {
    ...FONTS.body,
    color: COLORS.subtleText,
    fontSize: 15,
    letterSpacing: 0.5,
    opacity: 0.88,
  },
});

export default HomeScreen;