import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { getNextGeneralQuestion } from '../data/questions';
import { getNextMostLikelyQuestion } from '../data/mostLikelyQuestions';
import { getNextConfessionQuestion } from '../data/confessionQuestions';
import { getNextChallengeTask } from '../data/challengeQuestions';

// مثال للأسئلة العامة (Quiz) - فقط للتجربة إن لم تكن الأسئلة من ملف البيانات
const quizQuestions = [
  { text: 'ما هي عاصمة اليابان؟', options: ['طوكيو', 'أوساكا', 'كيوتو'], answer: 'طوكيو' },
  { text: 'ما هو أكبر الكواكب؟', options: ['المريخ', 'نبتون', 'المشتري'], answer: 'المشتري' },
  ...Array.from({ length: 98 }, (_, i) => ({
    text: `سؤال رقم ${i + 3}`,
    options: ['إجابة 1', 'إجابة 2', 'إجابة 3'],
    answer: 'إجابة 1',
  })),
];

export default function QuestionScreen({ navigation, route }) {
  const { players, type } = route.params;

  // مؤثر بصري عند ظهور السؤال
  const anim = useRef(new Animated.Value(0)).current;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [scores, setScores] = useState(players.map(() => 0));
  const [selected, setSelected] = useState(null);
  const [showNext, setShowNext] = useState(false);
  const [question, setQuestion] = useState(null); // السؤال الحالي من البيانات
  const [loading, setLoading] = useState(true);

  // جلب السؤال المناسب حسب نوع اللعبة (type)
  const fetchNextQuestion = async () => {
    setLoading(true);
    let nextQuestion = null;

    if (type === 'quiz') {
      // من القائمة المحلية (للاختبار فقط)
      nextQuestion = quizQuestions[currentIndex];
      if (!nextQuestion) {
        // عند الانتهاء
        endGame();
        return;
      }
    } else if (type === 'general') {
      nextQuestion = await getNextGeneralQuestion();
      if (!nextQuestion) {
        endGame();
        return;
      }
    } else if (type === 'most-likely') {
      nextQuestion = await getNextMostLikelyQuestion();
      if (!nextQuestion) {
        endGame();
        return;
      }
    } else if (type === 'confession') {
      nextQuestion = await getNextConfessionQuestion();
      if (!nextQuestion) {
        endGame();
        return;
      }
    } else if (type === 'challenge') {
      nextQuestion = await getNextChallengeTask();
      if (!nextQuestion) {
        endGame();
        return;
      }
    }
    setQuestion(nextQuestion);
    setSelected(null);
    setShowNext(false);
    anim.setValue(0);
    setTimeout(() => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }, 50);
    setLoading(false);
  };

  // جلب السؤال الأول عند فتح الشاشة
  useEffect(() => {
    fetchNextQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  // عند اختيار إجابة
  const handleAnswer = (answer) => {
    setSelected(answer);

    if (question && question.correctAnswer && answer === question.correctAnswer) {
      const newScores = [...scores];
      newScores[currentPlayerIndex] += 1;
      setScores(newScores);
    }

    setShowNext(true);
  };

  // الذهاب للسؤال التالي أو للنتيجة
  const goToNext = () => {
    const nextPlayer = (currentPlayerIndex + 1) % players.length;
    setCurrentPlayerIndex(nextPlayer);

    // في حالة quiz من القائمة المحلية
    if (type === 'quiz') {
      setCurrentIndex(currentIndex + 1);
    } else {
      // لبقية الأنواع لا يهم currentIndex، فقط جلب من الدوال غير المتكررة
      fetchNextQuestion();
    }
  };

  // إنهاء اللعبة (أو عند استنفاذ الأسئلة)
  const endGame = () => {
    const minScore = Math.min(...scores);
    const loserIndex = scores.findIndex(score => score === minScore);
    const loser = players[loserIndex];
    navigation.navigate('Result', { loser, scores, players });
  };

  // عرض خيارات الإجابة أو زر التالي فقط حسب نوع السؤال
  const renderOptions = () => {
    if (question && (question.options || question.correctAnswer)) {
      // سؤال اختيارات
      const opts = question.options || [];
      return opts.map((opt, i) => (
        <TouchableOpacity
          key={i}
          style={[
            styles.option,
            selected === opt && styles.selectedOption,
            showNext && (question.correctAnswer === opt) && styles.correctOption,
            showNext && (selected === opt && selected !== question.correctAnswer) && styles.wrongOption,
          ]}
          onPress={() => !showNext && handleAnswer(opt)}
        >
          <Text style={styles.optionText}>{opt}</Text>
        </TouchableOpacity>
      ));
    } else {
      // سؤال "من الأكثر احتمالاً" أو تحدي أو اعتراف أو غيره
      if (!showNext) {
        return (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => setShowNext(true)}
          >
            <Text style={styles.nextButtonText}>عرض التالي</Text>
          </TouchableOpacity>
        );
      }
      return null;
    }
  };

  if (loading || !question) {
    return (
      <View style={styles.container}>
        <Text style={styles.question}>جاري تحميل السؤال...</Text>
      </View>
    );
  }

  const currentPlayer = players[currentPlayerIndex];

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          opacity: anim,
          transform: [
            { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.93, 1] }) }
          ]
        }}
      >
        <Text style={styles.player}>
          👤 {typeof currentPlayer === 'object' ? currentPlayer.name : currentPlayer}، دورك الآن
        </Text>
        <Text style={styles.question}>{question.text || question}</Text>

        {renderOptions()}

        {showNext && (
          <TouchableOpacity style={styles.nextButton} onPress={goToNext}>
            <Text style={styles.nextButtonText}>التالي ▶</Text>
          </TouchableOpacity>
        )}

        {/* عرض الدرجات (Quiz فقط) */}
        {type === 'quiz' && (
          <View style={styles.scoresContainer}>
            <Text style={styles.scoresTitle}>الدرجات الحالية:</Text>
            <View style={styles.scoresList}>
              {players.map((player, idx) => (
                <View key={player.id || idx} style={styles.scoreItem}>
                  <Text style={styles.scoreName}>{typeof player === 'object' ? player.name : player}</Text>
                  <Text style={styles.scoreValue}>{scores[idx]}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E5F5',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  player: {
    fontSize: 22,
    marginBottom: 12,
    textAlign: 'center',
    color: '#6A1B9A',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  question: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#8E24AA',
    letterSpacing: 1,
  },
  option: {
    backgroundColor: '#CE93D8',
    padding: 15,
    marginVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#8E24AA',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
    width: 260,
    alignSelf: 'center',
  },
  selectedOption: {
    backgroundColor: '#8E24AA',
    borderWidth: 2,
    borderColor: '#BA68C8',
  },
  correctOption: {
    backgroundColor: '#43A047',
    borderWidth: 2,
    borderColor: '#388E3C',
  },
  wrongOption: {
    backgroundColor: '#E53935',
    borderWidth: 2,
    borderColor: '#B71C1C',
  },
  optionText: {
    color: '#fff',
    fontSize: 19,
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  nextButton: {
    backgroundColor: '#6A1B9A',
    padding: 15,
    marginTop: 28,
    borderRadius: 12,
    alignItems: 'center',
    width: 220,
    shadowColor: '#6A1B9A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 3,
    elevation: 2,
    alignSelf: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  scoresContainer: {
    marginTop: 34,
    alignItems: 'center',
  },
  scoresTitle: {
    fontSize: 18,
    color: '#6A1B9A',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  scoresList: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 6,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  scoreItem: {
    backgroundColor: '#E1BEE7',
    borderRadius: 8,
    padding: 7,
    marginHorizontal: 6,
    alignItems: 'center',
    minWidth: 70,
  },
  scoreName: {
    fontSize: 16,
    color: '#6A1B9A',
    fontWeight: 'bold',
  },
  scoreValue: {
    fontSize: 16,
    color: '#8E24AA',
    fontWeight: 'bold',
  },
});