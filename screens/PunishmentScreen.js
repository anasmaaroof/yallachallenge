// screens/PunishmentScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { funPenalties } from '../data/penalties';
import { COLORS, FONTS, SIZES } from '../constants/theme';

const { height } = Dimensions.get('window');
const USED_PENALTIES_KEY = '@used_penalties';

// دالة مساعدة لخلط المصفوفة
const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};


const PunishmentScreen = ({ navigation, route }) => {
  const { loserName } = route.params;
  const [currentPenalty, setCurrentPenalty] = useState(null);
  const [penaltyPool, setPenaltyPool] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- دالة جديدة ومحسّنة لتحضير العقوبات ---
  const preparePenalties = async () => {
    setIsLoading(true);
    try {
      const usedPenaltiesJson = await AsyncStorage.getItem(USED_PENALTIES_KEY);
      const usedPenaltyIds = usedPenaltiesJson ? JSON.parse(usedPenaltiesJson) : [];
      
      let availablePenalties = funPenalties.filter(p => !usedPenaltyIds.includes(p.id));

      if (availablePenalties.length === 0 && funPenalties.length > 0) {
        Alert.alert("تهانينا!", "لقد تم تنفيذ كل العقوبات المتاحة. سيتم إعادة تعيين القائمة.");
        await AsyncStorage.removeItem(USED_PENALTIES_KEY);
        availablePenalties = [...funPenalties];
      }
      
      const shuffledPool = shuffleArray(availablePenalties);
      setPenaltyPool(shuffledPool);
      // بعد تحضير القائمة، نعرض أول عقوبة منها
      showNextPenalty(shuffledPool);

    } catch (e) {
      console.error("Failed to initialize penalties.", e);
      setPenaltyPool(shuffleArray(funPenalties)); // Fallback in case of error
    } finally {
        setIsLoading(false);
    }
  };

  const markPenaltyAsUsed = async (penaltyId) => {
    try {
        const existingUsed = await AsyncStorage.getItem(USED_PENALTIES_KEY);
        const usedIds = existingUsed ? JSON.parse(existingUsed) : [];
        if (!usedIds.includes(penaltyId)) {
            usedIds.push(penaltyId);
            await AsyncStorage.setItem(USED_PENALTIES_KEY, JSON.stringify(usedIds));
        }
    } catch (e) {
        console.error("Failed to save used penalty.", e);
    }
  };

  // --- دالة جديدة ومحسّنة لعرض العقوبة التالية ---
  const showNextPenalty = (pool) => {
    // نستخدم الـ pool الحالي أو الذي في الـ state
    const currentPool = pool || penaltyPool;

    if (currentPool.length > 0) {
      const newPool = [...currentPool]; // ننسخ المصفوفة لضمان عدم التعديل المباشر
      const nextPenalty = newPool.pop(); // نسحب العقوبة التالية
      
      setCurrentPenalty(nextPenalty); // نعرضها
      markPenaltyAsUsed(nextPenalty.id); // نحفظها في الذاكرة
      setPenaltyPool(newPool); // نُحدّث القائمة المتبقية
    } else {
      // إذا انتهت كل العقوبات، نحضّر القائمة من جديد
      preparePenalties();
    }
  };

  useEffect(() => {
    preparePenalties();
  }, []);

  if (isLoading) {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>جاري تحضير عقوبة جديدة...</Text>
        </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>حان وقت العقوبة!</Text>
        <Text style={styles.loserName}>{loserName}</Text>
      </View>

      <View style={styles.penaltyCard}>
        <Text style={styles.penaltyText}>
          {currentPenalty ? currentPenalty.text : 'لا توجد عقوبات متاحة.'}
        </Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.rerollButton}
          onPress={() => showNextPenalty()} // الزر الآن يستدعي الدالة المحسّنة
        >
          <Text style={styles.rerollButtonText}>عقوبة أخرى</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => navigation.popToTop()}
        >
          <Text style={styles.doneButtonText}>العب مرة أخرى</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // تم التعديل للتوسيط أثناء التحميل
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SIZES.padding,
  },
  loadingText: {
    ...FONTS.h3,
    color: COLORS.text,
    marginTop: SIZES.padding,
  },
  titleContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    ...FONTS.h1,
    color: COLORS.text,
    textAlign: 'center',
  },
  loserName: {
    ...FONTS.h1,
    fontSize: SIZES.h1 * 1.2,
    color: COLORS.secondary,
    fontWeight: 'bold',
    marginTop: SIZES.base,
    textAlign: 'center',
  },
  penaltyCard: {
    width: '100%',
    minHeight: height / 4,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius * 2,
    padding: SIZES.padding,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 2,
    borderColor: COLORS.secondary,
    flex: 2, // يأخذ مساحة أكبر
  },
  penaltyText: {
    ...FONTS.h2,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: SIZES.h2 * 1.5,
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  rerollButton: {
    backgroundColor: 'transparent',
    paddingVertical: SIZES.base * 1.5,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
    borderWidth: 2,
    borderColor: COLORS.secondary,
    width: '90%',
    alignItems: 'center',
  },
  rerollButtonText: {
    ...FONTS.h3,
    color: COLORS.secondary,
  },
  doneButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.base * 2,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
    width: '90%',
    alignItems: 'center',
    marginTop: SIZES.padding / 2,
  },
  doneButtonText: {
    ...FONTS.button,
  },
});

export default PunishmentScreen;