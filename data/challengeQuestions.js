// قائمة التحديات (Challenge Tasks)
export const challengeTasks = [
  { id: 'ch_1', text: 'تحدث بدون تحريك شفتيك لمدة دقيقة كاملة.' },
  { id: 'ch_2', text: 'حاول أن تقول "أنا ذكي جدًا" وأنت تضحك بصوت عالٍ.' },
  { id: 'ch_3', text: 'كل قطعة ليمون كاملة دون أن تعبس أو تغير تعابير وجهك.' },
  { id: 'ch_4', text: 'حاول العد من 1 إلى 20 بلهجة مختلفة كل 5 أرقام.' },
  // ... باقي التحديات حتى ch_200
  { id: 'ch_200', text: 'ألقِ تحية وداعية درامية كأنك لن ترى اللاعبين مرة أخرى.' }
];

// --- دعم التقدم المتسلسل وعدم التكرار حتى انتهاء جميع التحديات ---

import AsyncStorage from '@react-native-async-storage/async-storage';

const PROGRESS_INDEX_KEY = 'progress_challenge_tasks';

/**
 * جلب المؤشر الحالي للتقدم المتسلسل
 */
export async function getChallengeTaskProgressIndex() {
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
export async function setChallengeTaskProgressIndex(index) {
  try {
    await AsyncStorage.setItem(PROGRESS_INDEX_KEY, index.toString());
  } catch (e) {}
}

/**
 * إعادة المؤشر للبداية
 */
export async function resetChallengeTaskProgressIndex() {
  try {
    await AsyncStorage.setItem(PROGRESS_INDEX_KEY, '0');
  } catch (e) {}
}

/**
 * جلب التحدي التالي في التسلسل مع حفظ التقدم وعدم التكرار حتى انتهاء جميع التحديات.
 * إذا انتهت التحديات، تبدأ من جديد (دورة جديدة).
 * استخدم هذه الدالة في شاشة التحديات لجلب التحدي التالي باستمرار.
 */
export async function getNextChallengeTask() {
  let currentIndex = await getChallengeTaskProgressIndex();
  if (currentIndex >= challengeTasks.length) {
    // انتهت جميع التحديات، أعد للبداية
    await resetChallengeTaskProgressIndex();
    currentIndex = 0;
  }
  const task = challengeTasks[currentIndex];
  await setChallengeTaskProgressIndex(currentIndex + 1);
  return task;
}

/**
 * ملاحظة هامة:
 * - هذه الطريقة تضمن أن كل تحدي يظهر مرة واحدة فقط في الجولة، وبالتسلسل، ولا يتكرر حتى تنتهي كل التحديات.
 * - عند إغلاق التطبيق والعودة لاحقًا، تبدأ من حيث توقفت.
 * - عند الانتهاء من جميع التحديات، تبدأ دورة جديدة من البداية.
 * - يمكن تطبيق نفس النظام على الأسئلة والعقوبات بأن يكون لكل نوع مفتاح خاص به في التخزين.
 */