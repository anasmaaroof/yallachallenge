import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert, ActivityIndicator, Animated } from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { getNextFunPenalty, resetFunPenaltiesProgressIndex } from '../data/penalties';

const { height } = Dimensions.get('window');

const PunishmentScreen = ({ navigation, route }) => {
  const { loserName } = route.params;
  const [currentPenalty, setCurrentPenalty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;

  // دالة لتحريك البطاقة عند عرض عقوبة جديدة
  const triggerCardAnimation = () => {
    cardAnim.setValue(0);
    Animated.spring(cardAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  // دالة اهتزاز عند عدم وجود عقوبة
  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 4, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  // جلب عقوبة جديدة غير متكررة
  const fetchNextPenalty = async (showAlertOnReset = true) => {
    setIsLoading(true);
    try {
      let penalty = await getNextFunPenalty();
      // إذا انتهت العقوبات (الدالة ترجع null أو undefined)
      if (!penalty) {
        if (showAlertOnReset) {
          Alert.alert("تهانينا!", "لقد تم تنفيذ كل العقوبات المتاحة. سيتم الآن إعادة تعيين القائمة.");
        }
        await resetFunPenaltiesProgressIndex();
        penalty = await getNextFunPenalty();
      }
      setCurrentPenalty(penalty);
      triggerCardAnimation();
    } catch (e) {
      setCurrentPenalty({ text: 'لم يتم العثور على عقوبات متاحة.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNextPenalty(false);
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
      {/* عنوان وتوضيح الخاسر */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>🎯 حان وقت العقوبة!</Text>
        <Text style={styles.loserName}>
          <Text style={{ fontSize: SIZES.h1 * 1.1 }}>😅 </Text>
          {loserName}
        </Text>
      </View>

      {/* بطاقة العقوبة مع مؤثر بصري */}
      <Animated.View
        style={[
          styles.penaltyCard,
          {
            transform: [
              { scale: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [0.93, 1] }) },
              { translateX: shakeAnim },
            ],
            shadowOpacity: 0.17,
          }
        ]}
      >
        <Text style={styles.penaltyText}>
          {currentPenalty ? currentPenalty.text : 'لا توجد عقوبات متاحة.'}
        </Text>
      </Animated.View>

      {/* الأزرار */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.rerollButton}
          onPress={() => fetchNextPenalty()}
        >
          <Text style={styles.rerollButtonText}>🔄 عقوبة أخرى</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => navigation.popToTop()}
        >
          <Text style={styles.doneButtonText}>🏠 العودة للرئيسية</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SIZES.base,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  loserName: {
    ...FONTS.h1,
    fontSize: SIZES.h1 * 1.15,
    color: COLORS.fail,
    fontWeight: 'bold',
    marginTop: SIZES.base,
    textAlign: 'center',
    letterSpacing: 1,
  },
  penaltyCard: {
    width: '100%',
    minHeight: height / 4,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius * 2,
    padding: SIZES.padding,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.17,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
    flex: 2,
    marginVertical: SIZES.base * 2,
  },
  penaltyText: {
    ...FONTS.h2,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: SIZES.h2 * 1.5,
    fontWeight: 'bold',
    letterSpacing: 0.7,
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
    marginBottom: SIZES.base,
  },
  rerollButtonText: {
    ...FONTS.h3,
    color: COLORS.secondary,
    fontWeight: 'bold',
    fontSize: SIZES.h2,
    letterSpacing: 1,
  },
  doneButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.base * 2,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
    width: '90%',
    alignItems: 'center',
    marginTop: SIZES.base / 2,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.17,
    shadowRadius: 6,
    elevation: 2,
  },
  doneButtonText: {
    ...FONTS.button,
    fontWeight: 'bold',
    color: COLORS.onPrimary,
    fontSize: SIZES.h3,
    letterSpacing: 1,
  },
});

export default PunishmentScreen;