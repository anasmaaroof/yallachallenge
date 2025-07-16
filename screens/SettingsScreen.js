import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { useSettings } from '../contexts/SettingsContext';
import { COLORS, FONTS, SIZES } from '../constants/theme';

const roundOptions = [1, 2, 3, 4, 5];

const SettingsScreen = ({ navigation }) => {
  const { settings, updateSetting } = useSettings();

  // تأكد من القيم الافتراضية
  const currentRounds = typeof settings.numberOfRounds === 'number' ? settings.numberOfRounds : 3;

  // حماية من undefined في updateSetting
  const safeUpdate = (key, value) => {
    if (typeof updateSetting === 'function') {
      updateSetting(key, value);
    }
  };

  // مكون فرعي لعرض كل إعداد بشكل منظم
  const SettingItem = ({ label, children, icon }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLabelRow}>
        {!!icon && <Text style={styles.settingIcon}>{icon}</Text>}
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      {children}
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>⚙️ الإعدادات</Text>

      {/* عدد الجولات */}
      <SettingItem label="عدد الجولات" icon="🔢">
        <View style={styles.optionsContainer}>
          {roundOptions.map(option => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                currentRounds === option && styles.optionButtonActive
              ]}
              onPress={() => safeUpdate('numberOfRounds', option)}
              activeOpacity={0.85}
            >
              <Text style={[
                styles.optionButtonText,
                currentRounds === option && styles.optionButtonTextActive
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </SettingItem>

      {/* مؤثرات صوتية */}
      <SettingItem label="مؤثرات صوتية" icon="🔊">
        <Switch
          onValueChange={(value) => safeUpdate('enableSoundEffects', value)}
          value={!!settings.enableSoundEffects}
          trackColor={{ false: COLORS.subtleText, true: COLORS.primary }}
          thumbColor={COLORS.surface}
        />
      </SettingItem>

      {/* موسيقى خلفية */}
      <SettingItem label="موسيقى خلفية" icon="🎵">
        <Switch
          onValueChange={(value) => safeUpdate('enableBackgroundMusic', value)}
          value={!!settings.enableBackgroundMusic}
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
  },
  scrollContent: {
    padding: SIZES.padding,
    paddingBottom: SIZES.padding * 2,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SIZES.padding * 1.5,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  settingItem: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding / 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.11,
    shadowRadius: 3,
    elevation: 2,
  },
  settingLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base * 2,
  },
  settingIcon: {
    fontSize: SIZES.h2,
    marginRight: SIZES.base,
  },
  settingLabel: {
    ...FONTS.h3,
    color: COLORS.text,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: SIZES.base,
    marginBottom: SIZES.base,
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
    marginHorizontal: 5,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.10,
    shadowRadius: 2,
    elevation: 1,
  },
  optionButtonActive: {
    backgroundColor: COLORS.primary,
    shadowOpacity: 0.15,
    borderColor: COLORS.primary,
  },
  optionButtonText: {
    ...FONTS.h3,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  optionButtonTextActive: {
    color: COLORS.surface,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;