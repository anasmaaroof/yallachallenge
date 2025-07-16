import { registerRootComponent } from 'expo';
import 'expo-dev-client'; // دعم Expo Dev Client لو أردت البناء المحلي والتطوير السريع

import App from './App';

// يمكنك إضافة أحداث بدء التطبيق أو تسجيل أي خدمة هنا مستقبلاً

// هذا يضمن أن التطبيق يعمل بشكل صحيح سواء في Expo Go أو البناء المحلي
registerRootComponent(App);