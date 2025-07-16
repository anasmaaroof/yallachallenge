import AsyncStorage from '@react-native-async-storage/async-storage';

// مفتاح التخزين لكل نوع (مثلاً: questions, penalties, challenges)
export const getProgressKey = (type) => `progress_${type}`;

// قراءة المؤشر الحالي من التخزين (مع دعم قيمة افتراضية)
export const getProgressIndex = async (type, defaultValue = 0) => {
  try {
    const key = getProgressKey(type);
    const value = await AsyncStorage.getItem(key);
    return value !== null ? parseInt(value, 10) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

// حفظ المؤشر الحالي في التخزين
export const setProgressIndex = async (type, index) => {
  try {
    const key = getProgressKey(type);
    await AsyncStorage.setItem(key, index.toString());
    return true;
  } catch (e) {
    return false;
  }
};

// إعادة المؤشر للبداية (عند انتهاء القائمة)
export const resetProgressIndex = async (type) => {
  try {
    const key = getProgressKey(type);
    await AsyncStorage.setItem(key, '0');
    return true;
  } catch (e) {
    return false;
  }
};

// قراءة كل مؤشرات التقدم (جميع الأنواع دفعة واحدة)
export const getAllProgressIndices = async (types, defaultValue = 0) => {
  try {
    const keys = types.map(getProgressKey);
    const result = await AsyncStorage.multiGet(keys);
    return result.reduce((acc, [key, value], idx) => {
      acc[types[idx]] = value !== null ? parseInt(value, 10) : defaultValue;
      return acc;
    }, {});
  } catch (e) {
    return types.reduce((acc, type) => {
      acc[type] = defaultValue;
      return acc;
    }, {});
  }
};

// تصفير جميع مؤشرات التقدم (مثلاً عند بدء لعبة جديدة)
export const resetAllProgressIndices = async (types) => {
  try {
    const pairs = types.map(type => [getProgressKey(type), '0']);
    await AsyncStorage.multiSet(pairs);
    return true;
  } catch (e) {
    return false;
  }
};

// حذف مؤشر أو كل المؤشرات (مثلاً عند إعادة ضبط التطبيق)
export const removeProgressIndex = async (type) => {
  try {
    const key = getProgressKey(type);
    await AsyncStorage.removeItem(key);
    return true;
  } catch (e) {
    return false;
  }
};

export const removeAllProgressIndices = async (types) => {
  try {
    const keys = types.map(getProgressKey);
    await AsyncStorage.multiRemove(keys);
    return true;
  } catch (e) {
    return false;
  }
};