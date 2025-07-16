import React, { createContext, useState, useContext, useCallback, useMemo, useEffect } from 'react';

// إعدادات افتراضية متكاملة
const defaultSettings = {
  numberOfRounds: 3,
  enableTimer: false,
  timerDuration: 30,
  enableSoundEffects: true,
  enableBackgroundMusic: false,
  volume: 0.7, // صوت افتراضي معتدل
};

// إنشاء السياق
const SettingsContext = createContext();

// حفظ واسترجاع الإعدادات من AsyncStorage (اختياري لكنه يفضل لتجربة المستخدم)
import AsyncStorage from '@react-native-async-storage/async-storage';
const SETTINGS_KEY = '@yalla_challenge_settings';

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  // استرجاع الإعدادات عند بدء التطبيق
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem(SETTINGS_KEY);
        if (savedSettings) {
          setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
        }
      } catch (e) {
        // إذا لم توجد إعدادات، نستخدم الافتراضية
        setSettings(defaultSettings);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  // تحديث وحفظ أي إعداد
  const updateSetting = useCallback(async (key, value) => {
    setSettings(prevSettings => {
      const newSettings = { ...prevSettings, [key]: value };
      AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
      return newSettings;
    });
  }, []);

  // تفريغ الإعدادات بالكامل (مثلاً عند إعادة ضبط التطبيق)
  const resetSettings = useCallback(async () => {
    setSettings(defaultSettings);
    await AsyncStorage.removeItem(SETTINGS_KEY);
  }, []);

  // القيمة الموفرة للسياق
  const contextValue = useMemo(() => ({
    settings,
    updateSetting,
    resetSettings,
    loading,
  }), [settings, updateSetting, resetSettings, loading]);

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};

// هوك مخصص لسهولة الاستخدام
export const useSettings = () => useContext(SettingsContext);