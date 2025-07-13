// contexts/SoundContext.js

import React, { createContext, useContext, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { useSettings } from './SettingsContext';

const SoundContext = createContext();

export const SoundProvider = ({ children }) => {
  const { settings } = useSettings();
  const sounds = useRef({}).current;

  // --- دالة جديدة لضبط وضع الصوت للتطبيق ---
  const configureAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        interruptionModeIOS: 2, // 'MixWithOthers'
        shouldDuckAndroid: false, // لا نخفض صوت التطبيقات الأخرى
        // --- هذا هو التعديل الأهم ---
        interruptionModeAndroid: 2, // 'DoNotMix' - يمنع أي محاولة لإيقاف أو خفض صوت التطبيقات الأخرى
        // --------------------------
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: false,
      });
    } catch (error) {
      console.error('Failed to set audio mode', error);
    }
  };

  const loadSounds = async () => {
    try {
      const soundFiles = {
        click: require('../assets/sounds/click.mp3'),
        correct: require('../assets/sounds/correct.mp3'),
        wrong: require('../assets/sounds/wrong.mp3'),
      };

      for (const key in soundFiles) {
        const { sound } = await Audio.Sound.createAsync(soundFiles[key]);
        sounds[key] = sound;
      }
      console.log('Sounds loaded successfully!');
    } catch (error) {
      console.error('Failed to load sounds', error);
    }
  };

  useEffect(() => {
    configureAudio();
    loadSounds();

    return () => {
      console.log('Unloading sounds');
      for (const key in sounds) {
        sounds[key].unloadAsync();
      }
    };
  }, []);

  const playSound = async (soundName) => {
    if (!settings.enableSoundEffects) {
      return;
    }
    
    const soundObject = sounds[soundName];
    if (soundObject) {
      try {
        await soundObject.replayAsync();
      } catch (error) {
        console.error(`Could not play sound: ${soundName}`, error);
      }
    } else {
      console.warn(`Sound '${soundName}' not found.`);
    }
  };

  return (
    <SoundContext.Provider value={{ playSound }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  return useContext(SoundContext);
};