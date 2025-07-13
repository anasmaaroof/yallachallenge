import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import truthOrDareQuestions from '../data/truthOrDareQuestions';
import mostLikelyQuestions from '../data/mostLikelyQuestions';

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

  const questions = type === 'truth-or-dare'
    ? truthOrDareQuestions.map(q => ({ text: q }))
    : type === 'most-likely'
    ? mostLikelyQuestions.map(q => ({ text: q }))
    : quizQuestions;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [scores, setScores] = useState(players.map(() => 0));
  const [selected, setSelected] = useState(null);
  const [showNext, setShowNext] = useState(false);

  const currentQuestion = questions[currentIndex];
  const currentPlayer = players[currentPlayerIndex];

  const handleAnswer = (answer) => {
    setSelected(answer);

    if (currentQuestion.answer && answer === currentQuestion.answer) {
      const newScores = [...scores];
      newScores[currentPlayerIndex] += 1;
      setScores(newScores);
    }

    setShowNext(true);
  };

  const goToNext = () => {
    const nextIndex = currentIndex + 1;
    const nextPlayer = (currentPlayerIndex + 1) % players.length;

    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
      setCurrentPlayerIndex(nextPlayer);
      setSelected(null);
      setShowNext(false);
    } else {
      const minScore = Math.min(...scores);
      const loserIndex = scores.findIndex(score => score === minScore);
      const loser = players[loserIndex];
      navigation.navigate('Result', { loser });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.player}>👤 {currentPlayer}، دورك الآن</Text>
      <Text style={styles.question}>{currentQuestion.text}</Text>

      {currentQuestion.options?.map((opt, i) => (
        <TouchableOpacity
          key={i}
          style={[
            styles.option,
            selected === opt && styles.selectedOption
          ]}
          onPress={() => !showNext && handleAnswer(opt)}
        >
          <Text style={styles.optionText}>{opt}</Text>
        </TouchableOpacity>
      ))}

      {showNext && (
        <TouchableOpacity style={styles.nextButton} onPress={goToNext}>
          <Text style={styles.nextButtonText}>التالي ▶</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E5F5',
    padding: 20,
    justifyContent: 'center',
  },
  player: {
    fontSize: 22,
    marginBottom: 12,
    textAlign: 'center',
  },
  question: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
  },
  option: {
    backgroundColor: '#CE93D8',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
  },
  selectedOption: {
    backgroundColor: '#8E24AA',
  },
  optionText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: '#6A1B9A',
    padding: 15,
    marginTop: 25,
    borderRadius: 10,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 20,
  },
});
