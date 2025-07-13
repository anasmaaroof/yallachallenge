// screens/GameTypeScreen.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { usePlayers } from '../contexts/PlayersContext';
import { COLORS, FONTS, SIZES } from '../constants/theme';

// --- استيراد بيانات الألعاب ---
import { generalQuestions } from '../data/questions';
import { mostLikelyQuestions } from '../data/mostLikelyQuestions';
import { confessionQuestions } from '../data/confessionQuestions';
import { challengeTasks } from '../data/challengeQuestions';
import { challengeMasterCards } from '../data/challengeMasterCards';
import { charadesWords } from '../data/charadesWords';
// تم حذف استيراد neverHaveIEverQuestions

// --- تنظيم بيانات أنواع الألعاب في مصفوفة ---
const gameTypes = [
  {
    id: 'charades',
    title: 'تمثيل صامت',
    description: 'اعرض الكلمة بدون كلام! من يخمنها يربح نقطة.',
    icon: '🎭',
    questions: charadesWords,
  },
  // --- تم حذف لعبة "أنا لم أفعل قط..." من هنا ---
  {
    id: 'general',
    title: 'أسئلة عامة',
    description: 'أسئلة متنوعة لاختبار معلوماتكم.',
    icon: '❓',
    questions: generalQuestions,
  },
  {
    id: 'mostLikely',
    title: 'من يفعلها؟',
    description: 'صوّتوا على اللاعبين الذين تنطبق عليهم العبارة!',
    icon: '👉',
    questions: mostLikelyQuestions,
  },
  {
    id: 'confession',
    title: 'كرسي الاعتراف',
    description: 'أسئلة جريئة وصريحة لكشف الأسرار.',
    icon: '🤫',
    questions: confessionQuestions,
  },
  {
    id: 'challenge',
    title: 'تحديات',
    description: 'نفّذوا تحديات ممتعة ومحرجة.',
    icon: '🔥',
    questions: challengeTasks,
  },
  {
    id: 'challengeMaster',
    title: 'الكل يلعب',
    description: 'تحديات جماعية! الحكم يختار من خالف القواعد.',
    icon: '🎲',
    questions: challengeMasterCards,
  },
];

const GameTypeScreen = ({ navigation }) => {
  const { players } = usePlayers();

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

  const selectGameType = (game) => {
    if (game.id === 'charades') {
      navigation.navigate('CharadesScreen', {
        gameTitle: game.title,
        words: game.questions,
      });
    } else {
      navigation.navigate('GameScreen', {
        players: players, 
        questions: game.questions,
        gameTitle: game.title,
        gameCategory: game.id,
      });
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {gameTypes.map((game) => (
        <TouchableOpacity
          key={game.id}
          style={styles.card}
          onPress={() => selectGameType(game)}
        >
          <Text style={styles.cardIcon}>{game.icon}</Text>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>{game.title}</Text>
            <Text style={styles.cardDescription}>{game.description}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

// ... الأنماط styles تبقى كما هي
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SIZES.padding,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.padding / 1.5,
    marginBottom: SIZES.padding / 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardIcon: {
    fontSize: SIZES.h1,
    marginRight: SIZES.base * 2,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    ...FONTS.h3,
    color: COLORS.primary,
    textAlign: 'left',
  },
  cardDescription: {
    ...FONTS.body,
    color: COLORS.subtleText,
    marginTop: SIZES.base / 2,
    textAlign: 'left',
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
    color: COLORS.secondary,
    marginBottom: SIZES.base,
  },
  errorMessage: {
    ...FONTS.body,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SIZES.padding,
  },
  errorButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.base * 1.5,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
  },
  errorButtonText: {
    ...FONTS.button,
  },
});

export default GameTypeScreen;