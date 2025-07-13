import React, { createContext, useState, useContext } from 'react';

// --- Define all your color palettes here ---
const themes = {
  default: {
    background: '#F0F2F5', // Light Gray background for default screens
    text: '#1C1C1E',       // Nearly Black text
    primary: '#007AFF',    // Standard Blue
    secondary: '#5856D6',  // Standard Purple
    surface: '#FFFFFF',    // White cards/surfaces
    subtleText: '#8A8A8E', // Gray for subtitles
    success: '#34C759',
    fail: '#FF3B30',
    buttonText: '#FFFFFF',
    buttonTextDark: '#1C1C1E',
  },
  general: {
    background: '#27374D', // Lighter Dark Navy Blue
    text: '#FFFFFF',       
    primary: '#5DADE2',    
    secondary: '#F4D03F',  
    surface: '#526D82',    
    subtleText: '#BDC3C7', 
    success: '#2ECC71',    
    fail: '#E74C3C',       
    buttonText: '#FFFFFF', 
    buttonTextDark: '#27374D',
  },
  mostLikely: {
    background: '#4A235A', // Lighter Deep Purple
    text: '#FFFFFF',       
    primary: '#EC7063',    
    secondary: '#5DADE2',  
    surface: '#6A359C',    
    subtleText: '#D2B4DE', 
    success: '#EC7063',
    fail: '#E74C3C',
    buttonText: '#FFFFFF',
    buttonTextDark: '#4A235A',
  },
  confession: {
    background: '#641E16', // Lighter Maroon
    text: '#FFFFFF',       
    primary: '#F5B041',    
    secondary: '#5DADE2',  
    surface: '#943126',    
    subtleText: '#E6B0AA', 
    success: '#F5B041',
    fail: '#BFC9CA',
    buttonText: '#FFFFFF',
    buttonTextDark: '#641E16',
  },
  challenge: {
    background: '#0B5351', // Lighter Dark Teal
    text: '#FFFFFF',       
    primary: '#F39C12',    
    secondary: '#48C9B0',  
    surface: '#008E9B',    
    subtleText: '#A3E4D7', 
    success: '#F39C12',
    fail: '#E74C3C',
    buttonText: '#FFFFFF',
    buttonTextDark: '#0B5351',
  },
  challengeMaster: {
    background: '#212121', // Lighter Charcoal Black
    text: '#FFFFFF',       
    primary: '#FBC02D',    
    secondary: '#7E57C2',  
    surface: '#424242',    
    subtleText: '#BDBDBD', 
    success: '#FBC02D',
    fail: '#EF5350',
    buttonText: '#FFFFFF',
    buttonTextDark: '#212121', 
  }
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState('default');

  const changeTheme = (name) => {
    setThemeName(name || 'default');
  };

  const currentTheme = themes[themeName] || themes.default;

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
