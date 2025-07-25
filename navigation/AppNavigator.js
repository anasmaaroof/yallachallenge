import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { useTheme } from '../contexts/ThemeContext';

import HomeScreen from '../screens/HomeScreen';
import PlayerInputScreen from '../screens/PlayerInputScreen';
import GameTypeScreen from '../screens/GameTypeScreen';
import GameScreen from '../screens/GameScreen';
import ResultScreen from '../screens/ResultScreen';
import PunishmentScreen from '../screens/PunishmentScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CharadesScreen from '../screens/CharadesScreen';

import { FONTS } from '../constants/theme';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.surface,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: theme.primary,
        headerTitleStyle: {
          ...FONTS.h3,
          color: theme.text,
          fontWeight: 'bold',
        },
        cardStyle: { backgroundColor: theme.background },
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PlayerInput"
        component={PlayerInputScreen}
        options={{
          title: 'إضافة اللاعبين',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="GameType"
        component={GameTypeScreen}
        options={{
          title: 'اختر نوع اللعبة',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="GameScreen"
        component={GameScreen}
        options={({ route }) => ({
          title: route.params?.gameTitle || 'اللعبة',
          headerLeft: null,
          gestureEnabled: false,
          headerBackTitleVisible: false,
        })}
      />
      <Stack.Screen
        name="CharadesScreen"
        component={CharadesScreen}
        options={({ route }) => ({
          title: route.params?.gameTitle || 'تمثيل صامت',
          headerBackTitleVisible: false,
        })}
      />
      <Stack.Screen
        name="Result"
        component={ResultScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Punishment"
        component={PunishmentScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'الإعدادات',
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;