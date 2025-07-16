import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { usePlayers } from '../contexts/PlayersContext';
import { COLORS, FONTS, SIZES } from '../constants/theme';

// استيراد دوال جلب الأسئلة غير المتكررة
import { getNextGeneralQuestion } from '../data/questions';
import { getNextMostLikelyQuestion } from '../data/mostLikelyQuestions';
import { getNextConfessionQuestion } from '../data/confessionQuestions';
import { getNextChallengeTask } from '../data/challengeQuestions';
import { getNextChallengeMasterCard } from '../data/challengeMasterCards';
import { getNextCharadesWord } from '../data/charadesWords';

const gameTypes = [
  {
    id: 'charades',
    title: 'تمثيل صامت',
    description: 'اعرض الكلمة بدون كلام! من يخمنها يربح نقطة.',
    icon: '🎭',
    color: COLORS.success,
    getNext: getNextCharadesWord,
    screen: 'CharadesScreen',
  },
  {
    id: 'general',
    title: 'أسئلة عامة',
    description: 'أسئلة متنوعة لاختبار معلوماتكم.',
    icon: '❓',
    color: COLORS.primary,
    getNext: getNextGeneralQuestion,
    screen: 'GameScreen',
  },
  {
    id: 'mostLikely',
    title: 'من يفعلها؟',
    description: 'صوّتوا على اللاعبين الذين تنطبق عليهم العبارة!',
    icon: '👉',
    color: COLORS.secondary,
    getNext: getNextMostLikelyQuestion,
    screen: 'GameScreen',
  },
  {
    id: 'confession',
    title: 'كرسي الاعتراف',
    description: 'أسئلة جريئة وصريحة لكشف الأسرار.',
    icon: '🤫',
    color: COLORS.fail,
    getNext: getNextConfessionQuestion,
    screen: 'GameScreen',
  },
  {
    id: 'challenge',
    title: 'تحديات',
    description: 'نفّذوا تحديات ممتعة ومحرجة.',
    icon: '🔥',
    color: COLORS.warning,
    getNext: getNextChallengeTask,
    screen: 'GameScreen',
  },
  {
    id: 'challengeMaster',
    title: 'الكل يلعب',
    description: 'تحديات جماعية! الحكم يختار من خالف القواعد.',
    icon: '🎲',
    color: COLORS.info,
    getNext: getNextChallengeMasterCard,
    screen: 'GameScreen',
  },
];

const GameTypeScreen = ({ navigation }) => {
  const { players } = usePlayers();
  const [pressedIdx, setPressedIdx] = React.useState(null);
  const anim = React.useRef(new Animated.Value(1)).current;

  if (!players || players.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>خطأ</Text>
        <Text style={styles.errorMessage}>الرجاء العودة وإضافة لاعبين أولاً.</Text>
        <TouchableOpacity style={styles.errorButton} onPress={() => navigation.goBack()}>
          <Text style={styles.errorButtonText}>العودة</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const selectGameType = async (game, idx) => {
    setPressedIdx(idx);
    Animated.sequence([
      Animated.timing(anim, { toValue: 0.97, duration: 100, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 1, duration: 130, useNativeDriver: true }),
    ]).start(async () => {
      setPressedIdx(null);

      // جلب السؤال أو العنصر الأول من الدالة المناسبة
      const firstQuestion = await game.getNext();

      if (!firstQuestion) {
        // انتهت الأسئلة/التحديات/الكلمات
        // يمكن عرض رسالة أو إعادة تعيين الدورة تلقائياً حسب دوال البيانات
        return;
      }

      if (game.screen === 'CharadesScreen') {
        navigation.navigate('CharadesScreen', {
          gameTitle: game.title,
        });
      } else {
        navigation.navigate('GameScreen', {
          players,
          firstQuestion,
          gameTitle: game.title,
          gameCategory: game.id,
        });
      }
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>اختر نوع اللعبة</Text>
      {gameTypes.map((game, idx) => (
        <Animated.View
          key={game.id}
          style={[
            styles.cardWrapper,
            pressedIdx === idx && { transform: [{ scale: anim }] }
          ]}
        >
          <TouchableOpacity
            style={[styles.card, { borderColor: game.color }]}
            onPress={() => selectGameType(game, idx)}
            activeOpacity={0.90}
          >
            <Text style={[styles.cardIcon, { color: game.color }]}>{game.icon}</Text>
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, { color: game.color }]}>{game.title}</Text>
              <Text style={styles.cardDescription}>{game.description}</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SIZES.padding,
    paddingBottom: SIZES.padding * 2,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SIZES.padding * 1.5,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  cardWrapper: {
    marginBottom: SIZES.padding / 1.2,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius * 1.5,
    padding: SIZES.padding,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 2,
  },
  cardIcon: {
    fontSize: SIZES.h1 + 12,
    marginRight: SIZES.base * 2,
    textShadowColor: COLORS.text,
    textShadowRadius: 2,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    ...FONTS.h2,
    textAlign: 'left',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  cardDescription: {
    ...FONTS.body,
    color: COLORS.subtleText,
    marginTop: SIZES.base / 2,
    textAlign: 'left',
    fontSize: SIZES.h3,
    letterSpacing: 0.5,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SIZES.padding,
  },
  errorTitle: {
    ...FONTS.h1,
    color: COLORS.fail,
    marginBottom: SIZES.base,
    fontWeight: 'bold',
  },
  errorMessage: {
    ...FONTS.body,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SIZES.padding,
    fontSize: SIZES.h3,
  },
  errorButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.base * 1.5,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
    marginTop: SIZES.base,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.10,
    shadowRadius: 3,
    elevation: 2,
  },
  errorButtonText: {
    ...FONTS.button,
    fontWeight: 'bold',
    color: COLORS.surface,
    fontSize: SIZES.h3,
    letterSpacing: 0.5,
  },
});

export default GameTypeScreen;