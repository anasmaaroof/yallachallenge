// screens/SettingsScreen.js

import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { useSettings } from '../contexts/SettingsContext';
import { COLORS, FONTS, SIZES } from '../constants/theme';

const SettingsScreen = ({ navigation }) => {
  const { settings, updateSetting } = useSettings();

  // --- الخيارات الجديدة لأزرار عدد الجولات ---
  const roundOptions = [1, 2, 3, 4, 5];

  // مكون فرعي لعرض كل إعداد بشكل منظم
  const SettingItem = ({ label, children }) => (
    <View style={styles.settingItem}>
      <Text style={styles.settingLabel}>{label}</Text>
      {children}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      
      {/* --- قسم عدد الجولات المحدث --- */}
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>عدد الجولات</Text>
        <View style={styles.optionsContainer}>
          {roundOptions.map(option => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                settings.numberOfRounds === option && styles.optionButtonActive
              ]}
              onPress={() => updateSetting('numberOfRounds', option)}
            >
              <Text style={[
                styles.optionButtonText,
                settings.numberOfRounds === option && styles.optionButtonTextActive
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* تفعيل/تعطيل المؤثرات الصوتية */}
      <SettingItem label="مؤثرات صوتية">
        <Switch
          onValueChange={(value) => updateSetting('enableSoundEffects', value)}
          value={settings.enableSoundEffects}
          trackColor={{ false: COLORS.subtleText, true: COLORS.primary }}
          thumbColor={COLORS.surface}
        />
      </SettingItem>

      {/* تفعيل/تعطيل الموسيقى الخلفية */}
      <SettingItem label="موسيقى خلفية">
        <Switch
          onValueChange={(value) => updateSetting('enableBackgroundMusic', value)}
          value={settings.enableBackgroundMusic}
          trackColor={{ false: COLORS.subtleText, true: COLORS.primary }}
          thumbColor={COLORS.surface}
        />
      </SettingItem>
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.padding,
  },
  settingItem: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding / 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingLabel: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SIZES.base * 2, // إضافة مسافة بين العنوان والأزرار
  },
  // --- أنماط جديدة لأزرار اختيار الجولات ---
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: SIZES.radius,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionButtonActive: {
    backgroundColor: COLORS.primary,
  },
  optionButtonText: {
    ...FONTS.h3,
    color: COLORS.primary,
  },
  optionButtonTextActive: {
    color: COLORS.surface,
  },
  // ------------------------------------
  slider: {
    width: 150,
    height: 40,
  }
});

export default SettingsScreen;