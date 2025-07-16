import React, { useEffect } from 'react';
import { I18nManager, StatusBar, Platform } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

// --- فرض اتجاه اليمين لليسار فقط في أول تشغيل ---
useEffect(() => {
  if (!I18nManager.isRTL) {
    try {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
      if (Platform.OS === 'android') {
        // إعادة تشغيل التطبيق قد تكون مطلوبة في بعض أجهزة أندرويد بعد تغيير RTL
      }
    } catch (e) {
      console.error('Failed to force RTL:', e);
    }
  }
}, []);

// --- استيراد الـ Providers ---
import { PlayersProvider } from './contexts/PlayersContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { SoundProvider } from './contexts/SoundContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

// --- استيراد الـ Navigator ---
import AppNavigator from './navigation/AppNavigator';

const CustomNavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F0FDFA', // يمكنك ربطه بـ theme.background إذا توفر
  },
};

export default function App() {
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  // شريط الحالة بلون متناسق مع الثيم الديناميكي
  const StatusBarDynamic = () => {
    const { theme } = useTheme();
    return (
      <StatusBar
        barStyle={theme.text === '#FFFFFF' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.primary}
      />
    );
  };

  return (
    <ThemeProvider>
      <SettingsProvider>
        <SoundProvider>
          <PlayersProvider>
            <NavigationContainer theme={CustomNavigationTheme}>
              <StatusBarDynamic />
              <AppNavigator />
            </NavigationContainer>
          </PlayersProvider>
        </SoundProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}