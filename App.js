// App.js

import React from 'react';
import { I18nManager } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

// --- فرض اتجاه اليمين لليسار ---
try {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
} catch (e) {
  console.error(e);
}

// --- استيراد الـ Providers ---
import { PlayersProvider } from './contexts/PlayersContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { SoundProvider } from './contexts/SoundContext';
import { ThemeProvider } from './contexts/ThemeContext';

// --- استيراد الـ Navigator ---
import AppNavigator from './navigation/AppNavigator';

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

  return (
    <ThemeProvider>
      <SettingsProvider>
        <SoundProvider>
          <PlayersProvider>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </PlayersProvider>
        </SoundProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}
