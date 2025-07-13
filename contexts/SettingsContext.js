// contexts/SettingsContext.js

import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';

// 1. إنشاء الـ Context
const SettingsContext = createContext();

// الإعدادات الافتراضية
const defaultSettings = {
  numberOfRounds: 3,
  enableTimer: false,
  timerDuration: 30,
  enableSoundEffects: true,
  enableBackgroundMusic: false,
};

// 2. إنشاء الـ Provider
export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);

  // دالة لتحديث أي إعداد
  // --- التعديل الأول: استخدام useCallback لتثبيت الدالة ---
  const updateSetting = useCallback((key, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [key]: value
    }));
  }, []);

  // قيمة الـ Context التي سيتم توفيرها للمكونات
  // --- التعديل الثاني: استخدام useMemo لتثبيت قيمة السياق ---
  const contextValue = useMemo(() => ({
    settings,
    updateSetting
  }), [settings, updateSetting]);

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};

// 3. إنشاء Hook مخصص لسهولة استخدام الـ Context
export const useSettings = () => {
  return useContext(SettingsContext);
};