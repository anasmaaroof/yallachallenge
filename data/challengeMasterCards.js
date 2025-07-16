// القواعد الدائمة (تُطبق طوال اللعبة)
export const permanentChallengeMasterRules = [
  { id: 'pr_1', text: 'ممنوع قول كلمة "لا".' },
  { id: 'pr_2', text: 'لا يُسمح باستخدام الأسماء الأولى للاعبين (استخدم الألقاب أو الصفات).' },
  { id: 'pr_3', text: 'يجب على الجميع إبقاء أعينهم مغلقة أثناء التحدث (يفتحها عند انتهاء كلامه).' },
  { id: 'pr_4', text: 'يجب رفع اليد قبل التحدث، والانتظار لإذن الحكم.' },
  { id: 'pr_5', text: 'يُمنع لمس الوجه باليدين أثناء اللعبة.' },
  { id: 'pr_6', text: 'إذا خالف أحد اللاعبين أيًا من هذه القواعد، يقوم الحكم بمعاقبته.' }
];

// بطاقات اللعبة الرئيسية (يتم سحبها في كل دور)
export const challengeMasterCards = [
  // ... جميع البطاقات مثل الكود الأصلي ...
  { id: 'cm_1', type: 'rule', text: 'على كل من يضحك، أن يصفق بيديه مرتين بصوت عالٍ.' },
  // ... إلخ حتى ...
  { id: 'cm_200', type: 'rule', text: 'يجب على الجميع إنهاء كل جملة بحركة رقص صغيرة.' }
];

// ملاحظة هامة: هذه الدوال تضبط "تكرار البطاقات" بحيث لا تتكرر البطاقة إلا بعد انتهاء جميع البطاقات.
// يجب استخدام AsyncStorage في React Native وليس localStorage كما في الكود الأصلي.

// --- دعم التقدم المتسلسل وعدم التكرار حتى انتهاء جميع البطاقات ---

import AsyncStorage from '@react-native-async-storage/async-storage';

const USED_CARDS_STORAGE_KEY = 'usedChallengeMasterCardIds';
const PROGRESS_INDEX_KEY = 'progress_challenge_master';

// جلب مصفوفة البطاقات المستخدمة من التخزين المحلي
export async function getUsedCardIds() {
  try {
    const ids = await AsyncStorage.getItem(USED_CARDS_STORAGE_KEY);
    return ids ? JSON.parse(ids) : [];
  } catch (e) {
    return [];
  }
}

// حفظ البطاقات المستخدمة في التخزين المحلي
export async function saveUsedCardIds(usedCardIds) {
  try {
    await AsyncStorage.setItem(USED_CARDS_STORAGE_KEY, JSON.stringify(usedCardIds));
  } catch (e) {}
}

// إعادة تعيين البطاقات المستخدمة
export async function resetUsedCardIds() {
  try {
    await AsyncStorage.removeItem(USED_CARDS_STORAGE_KEY);
  } catch (e) {}
}

// جلب المؤشر الحالي للتقدم المتسلسل
export async function getProgressIndex() {
  try {
    const value = await AsyncStorage.getItem(PROGRESS_INDEX_KEY);
    return value !== null ? parseInt(value, 10) : 0;
  } catch (e) {
    return 0;
  }
}

// حفظ المؤشر الحالي
export async function setProgressIndex(index) {
  try {
    await AsyncStorage.setItem(PROGRESS_INDEX_KEY, index.toString());
  } catch (e) {}
}

// إعادة المؤشر للبداية
export async function resetProgressIndex() {
  try {
    await AsyncStorage.setItem(PROGRESS_INDEX_KEY, '0');
  } catch (e) {}
}

/**
 * جلب البطاقة التالية في التسلسل مع حفظ التقدم وعدم التكرار حتى انتهاء جميع البطاقات.
 * إذا انتهت البطاقات، تبدأ من جديد (دورة جديدة).
 * استخدم هذه الدالة في شاشة اللعبة لجلب البطاقة التالية باستمرار.
 */
export async function getNextChallengeCard() {
  let currentIndex = await getProgressIndex();
  if (currentIndex >= challengeMasterCards.length) {
    // انتهت جميع البطاقات، أعد للبداية
    await resetProgressIndex();
    currentIndex = 0;
  }
  const card = challengeMasterCards[currentIndex];
  await setProgressIndex(currentIndex + 1);
  return card;
}

/**
 * ملاحظة مهمة:
 * - هذه الطريقة تضمن أن كل بطاقة تظهر مرة واحدة فقط في الجولة، وبالتسلسل، ولا تتكرر حتى تنتهي كل البطاقات.
 * - عند إغلاق التطبيق والعودة لاحقًا، تبدأ من حيث توقفت.
 * - عند الانتهاء من جميع البطاقات، تبدأ دورة جديدة من البداية.
 * - يمكن تطبيق نفس النظام على العقوبات والأسئلة بأن يكون لكل نوع مفتاح خاص به في التخزين (مثلاً progress_penalties).
 */