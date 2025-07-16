
import React, { createContext, useState, useContext } from 'react';

// --- Define all your color palettes here ---
const themes = {
  default: {
    background: '#F0F2F5',
    text: '#1C1C1E',
    primary: '#007AFF',
    primaryLight: '#B3D6FF',
    secondary: '#5856D6',
    surface: '#FFFFFF',
    subtleText: '#8A8A8E',
    success: '#34C759',
    fail: '#FF3B30',
    warning: '#F39C12',
    info: '#17A2B8',
    border: '#E5E5EA',
    buttonText: '#FFFFFF',
    buttonTextDark: '#1C1C1E',
    onPrimary: '#FFFFFF',
    onSuccess: '#FFFFFF',
  },
  general: {
    background: '#27374D',
    text: '#FFFFFF',
    primary: '#5DADE2',
    primaryLight: '#D6EAF8',
    secondary: '#F4D03F',
    surface: '#526D82',
    subtleText: '#BDC3C7',
    success: '#2ECC71',
    fail: '#E74C3C',
    warning: '#F39C12',
    info: '#17A2B8',
    border: '#34495E',
    buttonText: '#FFFFFF',
    buttonTextDark: '#27374D',
    onPrimary: '#FFFFFF',
    onSuccess: '#FFFFFF',
  },
  mostLikely: {
    background: '#4A235A',
    text: '#FFFFFF',
    primary: '#EC7063',
    primaryLight: '#F9EBEA',
    secondary: '#5DADE2',
    surface: '#6A359C',
    subtleText: '#D2B4DE',
    success: '#EC7063',
    fail: '#E74C3C',
    warning: '#F39C12',
    info: '#17A2B8',
    border: '#76448A',
    buttonText: '#FFFFFF',
    buttonTextDark: '#4A235A',
    onPrimary: '#FFFFFF',
    onSuccess: '#FFFFFF',
  },
  confession: {
    background: '#641E16',
    text: '#FFFFFF',
    primary: '#F5B041',
    primaryLight: '#FDEBD0',
    secondary: '#5DADE2',
    surface: '#943126',
    subtleText: '#E6B0AA',
    success: '#F5B041',
    fail: '#BFC9CA',
    warning: '#F39C12',
    info: '#17A2B8',
    border: '#922B21',
    buttonText: '#FFFFFF',
    buttonTextDark: '#641E16',
    onPrimary: '#FFFFFF',
    onSuccess: '#FFFFFF',
  },
  challenge: {
    background: '#0B5351',
    text: '#FFFFFF',
    primary: '#F39C12',
    primaryLight: '#FDEBD0',
    secondary: '#48C9B0',
    surface: '#008E9B',
    subtleText: '#A3E4D7',
    success: '#F39C12',
    fail: '#E74C3C',
    warning: '#F39C12',
    info: '#17A2B8',
    border: '#117864',
    buttonText: '#FFFFFF',
    buttonTextDark: '#0B5351',
    onPrimary: '#FFFFFF',
    onSuccess: '#FFFFFF',
  },
  challengeMaster: {
    background: '#212121',
    text: '#FFFFFF',
    primary: '#FBC02D',
    primaryLight: '#FFF9C4',
    secondary: '#7E57C2',
    surface: '#424242',
    subtleText: '#BDBDBD',
    success: '#FBC02D',
    fail: '#EF5350',
    warning: '#F39C12',
    info: '#17A2B8',
    border: '#616161',
    buttonText: '#FFFFFF',
    buttonTextDark: '#212121',
    onPrimary: '#FFFFFF',
    onSuccess: '#FFFFFF',
  },
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
    warning: '#F39C12',
    info: '#17A2B8',
    border: '#B2F7EF',
    buttonText: '#222831',
    buttonTextDark: '#FFFFFF',
    onPrimary: '#FFFFFF',
    onSuccess: '#FFFFFF',
  }
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState('default');

  const changeTheme = (name) => {
    setThemeName(name && themes[name] ? name : 'default');
  };

  const currentTheme = themes[themeName] || themes.default;

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, changeTheme, themeName }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);