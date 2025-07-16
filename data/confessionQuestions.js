// قائمة أسئلة الاعتراف (Confession Questions)
export const confessionQuestions = [
  { id: 'c_1', text: 'هل سبق وكذبت على أحد لأجل أن تتجنب الإحراج؟' },
  { id: 'c_2', text: 'ما أكثر شيء تندم عليه؟' },
  { id: 'c_3', text: 'هل أعجبت بشخص من طرف واحد لفترة طويلة؟' },
  { id: 'c_4', text: 'ما هو أكثر سر محرج تخفيه؟' },
  { id: 'c_5', text: 'هل سبق وأرسلت رسالة ثم تمنيت لو لم تفعل؟' },
  { id: 'c_6', text: 'ما هو أكثر شيء تخجل منه الآن؟' },
  { id: 'c_7', text: 'هل هناك شخص لا تستطيع نسيانه رغم مرور وقت طويل؟' },
  { id: 'c_8', text: 'هل سبق وأن شعرت بالغيرة من صديقك؟' },
  { id: 'c_9', text: 'ما هو أكثر موقف ندمت عليه في حياتك؟' },
  { id: 'c_10', text: 'هل سبق وتهربت من شخص تحبه؟' },
  { id: 'c_11', text: 'هل فكرت في شخص معين أثناء قراءة هذا السؤال؟' },
  { id: 'c_12', text: 'هل سبق وأحببت شخصًا وهو لا يعلم؟' },
  { id: 'c_13', text: 'ما هو الشيء الذي تتمنى تغييره في نفسك؟' },
  { id: 'c_14', text: 'هل تتابع شخصًا على السوشيال ميديا سراً؟' },
  { id: 'c_15', text: 'هل كذبت يومًا على والديك؟' },
  { id: 'c_16', text: 'هل سبق وأعجبت بصديق/ة صديقك؟' },
  { id: 'c_17', text: 'ما أكثر شيء تتظاهر به أمام الآخرين؟' },
  { id: 'c_18', text: 'هل تفتقد شخصًا الآن ولا تستطيع إخباره؟' },
  { id: 'c_19', text: 'ما هو أسوأ يوم في حياتك؟' },
  { id: 'c_20', text: 'هل سبق وقلت “أنا أحبك” دون أن تقصدها؟' },
  // ... أكمل باقي الأسئلة حتى c_200 بنفس النمط
  { id: 'c_200', text: 'هل تمنيت أن يتوقف العالم من حولك؟' }
];

// --- دعم التقدم المتسلسل وعدم التكرار حتى انتهاء جميع الأسئلة ---

import AsyncStorage from '@react-native-async-storage/async-storage';

const PROGRESS_INDEX_KEY = 'progress_confession_questions';

/**
 * جلب المؤشر الحالي للتقدم المتسلسل
 */
export async function getConfessionQuestionsProgressIndex() {
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
export async function setConfessionQuestionsProgressIndex(index) {
  try {
    await AsyncStorage.setItem(PROGRESS_INDEX_KEY, index.toString());
  } catch (e) {}
}

/**
 * إعادة المؤشر للبداية
 */
export async function resetConfessionQuestionsProgressIndex() {
  try {
    await AsyncStorage.setItem(PROGRESS_INDEX_KEY, '0');
  } catch (e) {}
}

/**
 * جلب سؤال الاعتراف التالي في التسلسل مع حفظ التقدم وعدم التكرار حتى انتهاء جميع الأسئلة.
 * إذا انتهت الأسئلة، تبدأ من جديد (دورة جديدة).
 * استخدم هذه الدالة في شاشة الاعترافات لجلب السؤال التالي باستمرار.
 */
export async function getNextConfessionQuestion() {
  let currentIndex = await getConfessionQuestionsProgressIndex();
  if (currentIndex >= confessionQuestions.length) {
    // انتهت جميع الأسئلة، أعد للبداية
    await resetConfessionQuestionsProgressIndex();
    currentIndex = 0;
  }
  const question = confessionQuestions[currentIndex];
  await setConfessionQuestionsProgressIndex(currentIndex + 1);
  return question;
}

/**
 * ملاحظة هامة:
 * - هذه الطريقة تضمن أن كل سؤال يظهر مرة واحدة فقط في الجولة، وبالتسلسل، ولا يتكرر حتى تنتهي كل الأسئلة.
 * - عند إغلاق التطبيق والعودة لاحقًا، تبدأ من حيث توقفت.
 * - عند الانتهاء من جميع الأسئلة، تبدأ دورة جديدة من البداية.
 * - يمكن تطبيق نفس النظام على العقوبات والتحديات بأن يكون لكل نوع مفتاح خاص به في التخزين.
 */