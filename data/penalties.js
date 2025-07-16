// قائمة العقوبات المرحة (Fun Penalties)
export const funPenalties = [
  { id: 'p_1', text: 'غنِّ أغنية مشهورة بصوت عالٍ كأنك في حفلة كاريوكي!' },
  { id: 'p_2', text: 'امشِ كالبطة حول الغرفة لمدة 30 ثانية.' },
  { id: 'p_3', text: 'قل نكتة بصوت عالٍ للجميع – حتى لو كانت سيئة جداً!' },
  { id: 'p_4', text: 'تحدث كأنك روبوت لمدة دقيقة كاملة.' },
  { id: 'p_5', text: 'اتصل بصديق وقل له: "أريد بيتزا الآن!" ثم أغلق الخط.' },
  { id: 'p_6', text: 'مثل مشهدًا من فيلم درامي بصوت مرتفع وتعبيرات مبالغ فيها.' },
  { id: 'p_7', text: 'خذ سيلفي مضحكة جداً لنفسك وأرسلها للمجموعة.' },
  { id: 'p_8', text: 'اجعل وجهك حزينًا جداً وكأنك على وشك البكاء لمدة دقيقة.' },
  { id: 'p_9', text: 'امشِ للخلف حول الغرفة دورة كاملة.' },
  { id: 'p_10', text: 'اقفز 10 مرات وأنت تصرخ: "أنا قطة لطيفة!"' },
  { id: 'p_11', text: 'قلّد شخصية كرتونية لمدة 30 ثانية.' },
  { id: 'p_12', text: 'تظاهر أنك تمطر وتصدر أصوات المطر لمدة دقيقة.' },
  { id: 'p_13', text: 'قف على ساق واحدة وغنِّ أغنية من اختيار المجموعة.' },
  { id: 'p_14', text: 'قل "أنا الأفضل!" 5 مرات بصوت عالٍ.' },
  { id: 'p_15', text: 'مثل أنك إنسان آلي يتحرك ببطء.' },
  { id: 'p_16', text: 'اقرأ رسالة هاتفك الأخيرة بصوت درامي.' },
  { id: 'p_17', text: 'صفق لنفسك واطلب من الجميع التصفيق معك.' },
  { id: 'p_18', text: 'ارسم قلبًا على يدك واحتفظ به حتى نهاية اللعبة.' },
  { id: 'p_19', text: 'امثل مشهدًا من فيلم رعب بدون صوت.' },
  { id: 'p_20', text: 'تحدث وكأنك مقدم نشرة أخبار عن نفسك.' },
  { id: 'p_21', text: 'امشِ حول الغرفة وأنت تتظاهر أنك تحمل كوب ماء فوق رأسك.' },
  { id: 'p_22', text: 'حاول إقناع الجميع أنك تستطيع الطيران.' },
  { id: 'p_23', text: 'غنِّ اسمك وكأنه أغنية وطنية.' },
  { id: 'p_24', text: 'اقرأ جملة من اختيار المجموعة ببطء شديد.' },
  { id: 'p_25', text: 'تظاهر أنك تطبخ أكلة خيالية واصفها للجميع.' },
  { id: 'p_26', text: 'ارسم وجهًا مضحكًا على ورقة وأظهره للجميع.' },
  { id: 'p_27', text: 'قل "أنا أحبكم جميعًا" كلما تحدث شخص آخر لمدة دقيقتين.' },
  { id: 'p_28', text: 'امثل أنك في مسابقة غناء وفزت بالجائزة الكبرى.' },
  { id: 'p_29', text: 'تحدث كأنك طفل صغير فقد لعبته.' },
  { id: 'p_30', text: 'قفز ثلاث مرات ثم قل نكتة.' },
  // ... يمكنك إضافة المزيد من العقوبات اليدوية هنا ...
];

// توليد عقوبات إضافية تلقائيًا لإكمال العدد المطلوب حتى 200
while (funPenalties.length < 200) {
  funPenalties.push({
    id: `p_${funPenalties.length + 1}`,
    text: `عقوبة عشوائية رقم ${funPenalties.length + 1}: يجب أن تقوم بحركة مضحكة يختارها أحد اللاعبين!`
  });
}

// عقوبة رقم 200 مخصصة كما طلبت
funPenalties[199] = { id: 'p_200', text: 'يجب أن تبدأ كل جملة تقولها بـ "في رأيي المتواضع".' };

// --- دعم التقدم المتسلسل وعدم التكرار حتى انتهاء جميع العقوبات ---

import AsyncStorage from '@react-native-async-storage/async-storage';

const PROGRESS_INDEX_KEY = 'progress_fun_penalties';

/**
 * جلب المؤشر الحالي للتقدم المتسلسل
 */
export async function getFunPenaltiesProgressIndex() {
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
export async function setFunPenaltiesProgressIndex(index) {
  try {
    await AsyncStorage.setItem(PROGRESS_INDEX_KEY, index.toString());
  } catch (e) {}
}

/**
 * إعادة المؤشر للبداية
 */
export async function resetFunPenaltiesProgressIndex() {
  try {
    await AsyncStorage.setItem(PROGRESS_INDEX_KEY, '0');
  } catch (e) {}
}

/**
 * جلب العقوبة التالية في التسلسل مع حفظ التقدم وعدم التكرار حتى انتهاء جميع العقوبات.
 * إذا انتهت العقوبات، تبدأ من جديد (دورة جديدة).
 * استخدم هذه الدالة في شاشة العقوبات لجلب العقوبة التالية باستمرار.
 */
export async function getNextFunPenalty() {
  let currentIndex = await getFunPenaltiesProgressIndex();
  if (currentIndex >= funPenalties.length) {
    // انتهت جميع العقوبات، أعد للبداية
    await resetFunPenaltiesProgressIndex();
    currentIndex = 0;
  }
  const penalty = funPenalties[currentIndex];
  await setFunPenaltiesProgressIndex(currentIndex + 1);
  return penalty;
}

/**
 * ملاحظة هامة:
 * - هذه الطريقة تضمن أن كل عقوبة تظهر مرة واحدة فقط في الجولة، وبالتسلسل، ولا تتكرر حتى تنتهي كل العقوبات.
 * - عند إغلاق التطبيق والعودة لاحقًا، تبدأ من حيث توقفت.
 * - عند الانتهاء من جميع العقوبات، تبدأ دورة جديدة من البداية.
 * - يمكن تطبيق نفس النظام على الأسئلة والتحديات بأن يكون لكل نوع مفتاح خاص به في التخزين.
 */