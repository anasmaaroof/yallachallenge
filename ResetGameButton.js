import React, { useCallback } from 'react';
import { Button, Alert, StyleSheet, View, Platform } from 'react-native';

// استيراد جميع دوال إعادة التعيين
import { resetUsedCardIds } from '../data/challengeMasterCards';
import { resetUsedCharadesIndices } from '../data/charadesWords';
import { resetUsedMostLikelyIds } from '../data/mostLikelyQuestions';
import { resetUsedConfessionIds } from '../data/confessionQuestions';
import { resetUsedTaskIds } from '../data/challengeQuestions';
import { resetUsedPenaltyIds } from '../data/penalties';
import { resetUsedGeneralQuestionIds } from '../data/questions';

// --- تحسين: إضافة مؤشر تحميل أثناء إعادة التعيين ---
import { useState } from 'react';
import { ActivityIndicator } from 'react-native';

const ResetGameButton = () => {
  const [loading, setLoading] = useState(false);

  // دالة موحدة لإعادة تعيين كل البيانات
  const performReset = useCallback(async () => {
    try {
      setLoading(true);

      // إذا كانت دوال إعادة التعيين غير متزامنة، استخدم await
      await Promise.all([
        resetUsedCardIds(),
        resetUsedCharadesIndices(),
        resetUsedMostLikelyIds(),
        resetUsedConfessionIds(),
        resetUsedTaskIds(),
        resetUsedPenaltyIds(),
        resetUsedGeneralQuestionIds(),
      ]);

      // رسالة نجاح
      Alert.alert("تم بنجاح!", "تم إعادة تعيين اللعبة. استمتعوا بالجولة الجديدة!");
    } catch (error) {
      Alert.alert("خطأ", "حدث خطأ أثناء إعادة التعيين. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleReset = () => {
    Alert.alert(
      "بدء لعبة جديدة؟",
      "سيؤدي هذا إلى مسح كل الأسئلة والتحديات المستخدمة سابقاً. هل أنت متأكد؟",
      [
        { text: "إلغاء", style: "cancel" },
        { 
          text: "نعم، ابدأ من جديد", 
          onPress: performReset
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#c0392b" />
      ) : (
        <Button 
          title="بدء لعبة جديدة (إعادة تعيين)" 
          onPress={handleReset} 
          color={Platform.OS === 'ios' ? undefined : "#c0392b"}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    width: '80%',
    alignSelf: 'center',
  }
});

export default ResetGameButton;