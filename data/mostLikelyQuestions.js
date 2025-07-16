// قائمة أسئلة "من الأكثر احتمالاً" (Most Likely Questions)
export const mostLikelyQuestions = [
  { id: 'ml_1', text: 'ينسى عيد ميلاد صديقه.' },
  { id: 'ml_2', text: 'يضحك في وقت غير مناسب.' },
  // ... جميع الأسئلة حتى
  { id: 'ml_200', text: 'يخاف من كل الحضارات.' },
  { id: 'nhe_1', text: 'يأكل طعاماً سقط على الأرض.' },
  // ... جميع الأسئلة حتى
  { id: 'nhe_50', text: 'يتحدى الخوف من المرتفعات.' },
];

// --- دعم التقدم المتسلسل وعدم التكرار حتى انتهاء جميع الأسئلة ---

import AsyncStorage from '@react-native-async-storage/async-storage';

const PROGRESS_INDEX_KEY = 'progress_most_likely_questions';

/**
 * جلب المؤشر الحالي للتقدم المتسلسل
 */
export async function getMostLikelyQuestionsProgressIndex() {
  try {
    const value = await AsyncStorage.getItem(PROGRESS_INDEX_KEY);
    return value !== null ? parseInt(value, 10) : 0;
  } catch (e) {
    return 0;
  }
}

/**
 * حفظ المؤشر الحالي
 */
export async function setMostLikelyQuestionsProgressIndex(index) {
  try {
    await AsyncStorage.setItem(PROGRESS_INDEX_KEY, index.toString());
  } catch (e) {}
}

/**
 * إعادة المؤشر للبداية
 */
export async function resetMostLikelyQuestionsProgressIndex() {
  try {
    await AsyncStorage.setItem(PROGRESS_INDEX_KEY, '0');
  } catch (e) {}
}

/**
 * جلب سؤال "من الأكثر احتمالاً" التالي في التسلسل مع حفظ التقدم وعدم التكرار حتى انتهاء جميع الأسئلة.
 * إذا انتهت الأسئلة، تبدأ من جديد (دورة جديدة).
 * استخدم هذه الدالة في شاشة "من الأكثر احتمالاً" لجلب السؤال التالي باستمرار.
 */
export async function getNextMostLikelyQuestion() {
  let currentIndex = await getMostLikelyQuestionsProgressIndex();
  if (currentIndex >= mostLikelyQuestions.length) {
    // انتهت جميع الأسئلة، أعد للبداية
    await resetMostLikelyQuestionsProgressIndex();
    currentIndex = 0;
  }
  const question = mostLikelyQuestions[currentIndex];
  await setMostLikelyQuestionsProgressIndex(currentIndex + 1);
  return question;
}

/**
 * ملاحظة هامة:
 * - هذه الطريقة تضمن أن كل سؤال يظهر مرة واحدة فقط في الجولة، وبالتسلسل، ولا يتكرر حتى تنتهي كل الأسئلة.
 * - عند إغلاق التطبيق والعودة لاحقًا، تبدأ من حيث توقفت.
 * - عند الانتهاء من جميع الأسئلة، تبدأ دورة جديدة من البداية.
 * - يمكن تطبيق نفس النظام على باقي الألعاب والأسئلة بأن يكون لكل نوع مفتاح خاص به في التخزين.
 */