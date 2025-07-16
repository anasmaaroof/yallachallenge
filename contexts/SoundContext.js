import React, { createContext, useContext, useEffect, useRef } from 'react';
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';
import { useSettings } from './SettingsContext';

const SoundContext = createContext();

const SOUND_FILES = {
  start: require('../assets/sounds/start.mp3'),
  click: require('../assets/sounds/click.mp3'),
  correct: require('../assets/sounds/correct.mp3'),
  wrong: require('../assets/sounds/wrong.mp3'),
  // أضف المزيد إذا أردت مثلاً: 'win', 'lose', إلخ
};

export const SoundProvider = ({ children }) => {
  const { settings } = useSettings();
  const soundsRef = useRef({});

  // إعدادات الصوتيات العامة
  const configureAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: false,
      });
    } catch (error) {
      console.error('Failed to set audio mode', error);
    }
  };

  // تحميل الملفات الصوتية مرة واحدة
  const loadSounds = async () => {
    try {
      for (const key in SOUND_FILES) {
        if (!soundsRef.current[key]) {
          const { sound } = await Audio.Sound.createAsync(SOUND_FILES[key]);
          soundsRef.current[key] = sound;
        }
      }
      // يمكنك وضع رسالة نجاح هنا إذا أردت
    } catch (error) {
      console.error('Failed to load sounds', error);
    }
  };

  useEffect(() => {
    configureAudio();
    loadSounds();

    return () => {
      // تفريغ الأصوات عند إلغاء المكون
      for (const key in soundsRef.current) {
        if (soundsRef.current[key]) {
          soundsRef.current[key].unloadAsync();
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // دالة تشغيل الصوت (تدعم مستوى الصوت من الإعدادات)
  const playSound = async (soundName) => {
    if (!settings.enableSoundEffects) return;
    const soundObject = soundsRef.current[soundName];
    if (soundObject) {
      try {
        await soundObject.stopAsync();
        await soundObject.setVolumeAsync(typeof settings.volume === "number" ? settings.volume : 0.7);
        await soundObject.playAsync();
      } catch (error) {
        console.error(`Could not play sound: ${soundName}`, error);
      }
    } else {
      // يمكنك وضع رسالة تحذير هنا أو تجاهل الطلب
      // console.warn(`Sound '${soundName}' not found.`);
    }
  };

  return (
    <SoundContext.Provider value={{ playSound }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => useContext(SoundContext);