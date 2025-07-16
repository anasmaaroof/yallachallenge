// قائمة الأسئلة العامة (General Questions)
export const generalQuestions = [
  { id: 'gq_1', text: 'ما عاصمة فرنسا؟', options: ['برلين', 'باريس', 'مدريد'], correctAnswer: 'باريس' },
  { id: 'gq_2', text: 'كم عدد قارات العالم؟', options: ['5', '6', '7'], correctAnswer: '7' },
  { id: 'gq_3', text: 'ما هو أكبر كوكب في المجموعة الشمسية؟', options: ['الأرض', 'المشتري', 'زحل'], correctAnswer: 'المشتري' },
  { id: 'gq_4', text: 'من هو مخترع المصباح الكهربائي؟', options: ['نيكولا تيسلا', 'توماس إديسون', 'ألكسندر جراهام بيل'], correctAnswer: 'توماس إديسون' },
  { id: 'gq_5', text: 'ما هو أسرع حيوان بري في العالم؟', options: ['الفهد', 'الأسد', 'النمر'], correctAnswer: 'الفهد' },
  { id: 'gq_6', text: 'ما هو أطول نهر في العالم؟', options: ['الأمازون', 'النيل', 'المسيسيبي'], correctAnswer: 'النيل' },
  { id: 'gq_7', text: 'في أي عام انتهت الحرب العالمية الثانية؟', options: ['1945', '1918', '1939'], correctAnswer: '1945' },
  { id: 'gq_8', text: 'من رسم لوحة الموناليزا؟', options: ['فينسنت فان جوخ', 'بابلو بيكاسو', 'ليوناردو دافنشي'], correctAnswer: 'ليوناردو دافنشي' },
  { id: 'gq_9', text: 'ما هو أكبر محيط في العالم؟', options: ['الأطلسي', 'الهندي', 'الهادئ'], correctAnswer: 'الهادئ' },
  { id: 'gq_10', text: 'ما هي عاصمة اليابان؟', options: ['كيوتو', 'أوساكا', 'طوكيو'], correctAnswer: 'طوكيو' },
  // ... (تستمر القائمة لتشمل 490 سؤالاً إضافياً)
  { id: 'gq_500', text: 'ما هو اسم العملة المستخدمة في سويسرا؟', options: ['اليورو', 'الدولار', 'الفرنك السويسري'], correctAnswer: 'الفرنك السويسري' }
];

// --- دعم التقدم المتسلسل وعدم التكرار حتى انتهاء جميع الأسئلة ---

import AsyncStorage from '@react-native-async-storage/async-storage';

const PROGRESS_INDEX_KEY = 'progress_general_questions';

/**
 * جلب المؤشر الحالي للتقدم المتسلسل
 */
export async function getGeneralQuestionsProgressIndex() {
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
export async function setGeneralQuestionsProgressIndex(index) {
  try {
    await AsyncStorage.setItem(PROGRESS_INDEX_KEY, index.toString());
  } catch (e) {}
}

/**
 * إعادة المؤشر للبداية
 */
export async function resetGeneralQuestionsProgressIndex() {
  try {
    await AsyncStorage.setItem(PROGRESS_INDEX_KEY, '0');
  } catch (e) {}
}

/**
 * جلب سؤال عام التالي في التسلسل مع حفظ التقدم وعدم التكرار حتى انتهاء جميع الأسئلة.
 * إذا انتهت الأسئلة، تبدأ من جديد (دورة جديدة).
 * استخدم هذه الدالة في شاشة الأسئلة العامة لجلب السؤال التالي باستمرار.
 */
export async function getNextGeneralQuestion() {
  let currentIndex = await getGeneralQuestionsProgressIndex();
  if (currentIndex >= generalQuestions.length) {
    // انتهت جميع الأسئلة، أعد للبداية
    await resetGeneralQuestionsProgressIndex();
    currentIndex = 0;
  }
  const question = generalQuestions[currentIndex];
  await setGeneralQuestionsProgressIndex(currentIndex + 1);
  return question;
}

/**
 * ملاحظة هامة:
 * - هذه الطريقة تضمن أن كل سؤال يظهر مرة واحدة فقط في الجولة، وبالتسلسل، ولا يتكرر حتى تنتهي كل الأسئلة.
 * - عند إغلاق التطبيق والعودة لاحقًا، تبدأ من حيث توقفت.
 * - عند الانتهاء من جميع الأسئلة، تبدأ دورة جديدة من البداية.
 * - يمكن تطبيق نفس النظام على العقوبات والتحديات بأن يكون لكل نوع مفتاح خاص به في التخزين.
 */