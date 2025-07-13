// screens/GameScreen.js

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePlayers } from '../contexts/PlayersContext';
import { useSettings } from '../contexts/SettingsContext';
import { useSound } from '../contexts/SoundContext';
import { useTheme } from '../contexts/ThemeContext';
import { FONTS, SIZES } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

// --- (مكونات العرض الفرعية PlayerHeader, QuestionCard, InstructionsModal تبقى كما هي) ---
const PlayerHeader = ({ gameCategory, currentPlayer, currentJudge, round, onRulePress, styles }) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.roundText}>الجولة {round}</Text>
      {gameCategory === 'challengeMaster' ? (
        <View style={styles.judgeHeader}>
          <TouchableOpacity onPress={onRulePress} style={styles.ruleIcon}>
            <Text style={{fontSize: SIZES.h2}}>💡</Text>
          </TouchableOpacity>
          <Text style={styles.judgeNameText}>
            الحكم: {currentJudge?.name || '...'}
          </Text>
        </View>
      ) : (
        <View style={styles.playerInfoContainer}>
          <Text style={styles.playerTurnText}>
            دور اللاعب: <Text style={styles.currentPlayerName}>{currentPlayer?.name || '...'}</Text>
            <Text> (نقاط: </Text>
            <Text style={styles.playerScoreText}>{(currentPlayer?.score || 0)}</Text>
            <Text>)</Text>
          </Text>
        </View>
      )}
    </View>
  );
};
const QuestionCard = ({ question, styles }) => (
  <View style={styles.cardContainer}>
    <Text style={styles.cardText}>{question?.text || 'جاري تحميل السؤال...'}</Text>
  </View>
);
const InstructionsModal = ({ visible, onClose, instructions, styles }) => (
  <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>{instructions.title}</Text>
        <ScrollView><Text style={styles.modalMessage}>{instructions.message}</Text></ScrollView>
        <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}><Text style={styles.modalCloseButtonText}>فهمت، لنبدأ!</Text></TouchableOpacity>
      </View>
    </View>
  </Modal>
);
// --- (نهاية المكونات الفرعية) ---


const GameScreen = ({ navigation, route }) => {
  const { questions, gameTitle, players: initialPlayers, gameCategory } = route.params;
  
  const { theme, changeTheme } = useTheme(); 
  const styles = getStyles(theme);

  const { updatePlayerScore } = usePlayers();
  const { settings } = useSettings();
  const { playSound } = useSound();

  const [gameState, setGameState] = useState('loading');
  const [isInstructionsVisible, setInstructionsVisible] = useState(false);
  const [answered, setAnswered] = useState(null);
  const [outcome, setOutcome] = useState(null);
  const [penalizedPlayerIds, setPenalizedPlayerIds] = useState([]);
  const [mostLikelySelectedIds, setMostLikelySelectedIds] = useState([]);

  const [players, setPlayers] = useState(() => initialPlayers.map(p => ({ ...p, score: p.score || 0 })));
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [round, setRound] = useState(1);
  const [currentJudgeIndex, setCurrentJudgeIndex] = useState(0);

  const questionPoolRef = useRef([]);
  const USED_QUESTIONS_KEY = `@used_questions_${gameCategory}`;

  useEffect(() => {
    changeTheme(gameCategory);
    initializeGame();
  }, [gameCategory]);

  const markQuestionAsUsed = async (questionId) => {
    try {
        const existingUsed = await AsyncStorage.getItem(USED_QUESTIONS_KEY);
        const usedIds = existingUsed ? JSON.parse(existingUsed) : [];
        usedIds.push(questionId);
        await AsyncStorage.setItem(USED_QUESTIONS_KEY, JSON.stringify(usedIds));
    } catch (e) {
        console.error("Failed to save used question.", e);
    }
  };

  const initializeGame = async () => {
    setGameState('loading');
    try {
      const usedQuestionsJson = await AsyncStorage.getItem(USED_QUESTIONS_KEY);
      const usedQuestionIds = usedQuestionsJson ? JSON.parse(usedQuestionsJson) : [];
      
      let availableQuestions = questions.filter(q => !usedQuestionIds.includes(q.id));

      if (availableQuestions.length === 0 && questions.length > 0) {
        Alert.alert("تهانينا!", `لقد أكملتم كل الأسئلة في لعبة "${gameTitle}". سيتم الآن إعادة تعيين القائمة.`);
        await AsyncStorage.removeItem(USED_QUESTIONS_KEY);
        availableQuestions = [...questions];
      }
      
      questionPoolRef.current = shuffleArray(availableQuestions);
      
      const firstQuestion = getNextQuestion();
      if (firstQuestion) {
        setCurrentQuestion(firstQuestion);
        markQuestionAsUsed(firstQuestion.id);
        setGameState('playing');
        setInstructionsVisible(true);
      } else {
        Alert.alert("خطأ", "لا توجد أسئلة متاحة لهذه اللعبة.", [{ text: "العودة", onPress: () => navigation.goBack() }]);
      }
    } catch (e) {
      console.error("Failed to initialize game.", e);
      questionPoolRef.current = shuffleArray([...questions]);
      setGameState('playing');
    }
  };
  
  const getNextQuestion = () => {
    if (questionPoolRef.current.length > 0) {
      return questionPoolRef.current.pop();
    }
    // إذا انتهت الأسئلة، نعيد تهيئة اللعبة
    initializeGame();
    return null;
  };
  
  const moveToNext = () => {
    setAnswered(null);
    setMostLikelySelectedIds([]);
    setOutcome(null);
    setPenalizedPlayerIds([]);
    
    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
    
    if (gameCategory === 'challengeMaster') {
        const nextJudgeIndex = (currentJudgeIndex + 1) % players.length;
        setCurrentJudgeIndex(nextJudgeIndex);
        if (nextJudgeIndex === 0) setRound(prev => prev + 1);
    } else {
      setCurrentPlayerIndex(nextPlayerIndex);
      if (nextPlayerIndex === 0) setRound(prev => prev + 1);
    }

    const newCard = getNextQuestion();
    if (newCard) {
      setCurrentQuestion(newCard);
      markQuestionAsUsed(newCard.id);
    } else {
      // سيتم التعامل مع نهاية الأسئلة داخل getNextQuestion
    }
  };

  const endGame = () => {
    changeTheme('default');
    navigation.replace('Result', { players, gameCategory });
  };

  useEffect(() => {
    if (round > settings.numberOfRounds) {
      endGame();
    }
  }, [round, settings.numberOfRounds]);
  
  const handleScoreUpdate = (playerIds, points) => {
    const idsToUpdate = Array.isArray(playerIds) ? playerIds : [playerIds];
    setPlayers(currentPlayers => {
        const newPlayers = currentPlayers.map(player => {
            if (idsToUpdate.includes(player.id)) {
                const updatedScore = player.score + points;
                updatePlayerScore(player.id, updatedScore);
                return { ...player, score: updatedScore };
            }
            return player;
        });
        return newPlayers;
    });
  };
  
  // --- (دوال التعامل مع الإجابات تبقى كما هي) ---
  const handleGeneralAnswer = (selectedOption) => {
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    playSound(isCorrect ? 'correct' : 'wrong');
    handleScoreUpdate(currentPlayer.id, isCorrect ? 1 : -1);
    setAnswered({ selected: selectedOption, correct: currentQuestion.correctAnswer });
    setTimeout(moveToNext, 1500);
  };
  const handleConfessionChallengeOutcome = (success) => {
    playSound(success ? 'correct' : 'wrong');
    handleScoreUpdate(currentPlayer.id, success ? 1 : -1);
    setOutcome(success ? 'success' : 'fail');
    setTimeout(moveToNext, 1500);
  };
  const handleTogglePenalty = (playerId) => {
    playSound('click');
    setPenalizedPlayerIds(prev => prev.includes(playerId) ? prev.filter(id => id !== playerId) : [...prev, playerId]);
  };
  const confirmPenalties = () => {
    if (penalizedPlayerIds.length === 0) {
      Alert.alert("تنبيه", "الرجاء اختيار اللاعبين المخالفين أولاً، أو اضغط 'لا يوجد مخالفون'.");
      return;
    }
    playSound('wrong');
    handleScoreUpdate(penalizedPlayerIds, -1);
    setTimeout(moveToNext, 1500);
  };
  const handleMostLikelyToggle = (playerId) => {
    playSound('click');
    setMostLikelySelectedIds(prev => prev.includes(playerId) ? prev.filter(id => id !== playerId) : [...prev, playerId]);
  };
  const confirmMostLikely = () => {
    if (mostLikelySelectedIds.length > 0) {
      playSound('wrong');
      handleScoreUpdate(mostLikelySelectedIds, -1);
    }
    setTimeout(moveToNext, 1000);
  };
   const confirmNeverHaveIEver = () => {
    if (mostLikelySelectedIds.length > 0) {
      playSound('wrong');
      handleScoreUpdate(mostLikelySelectedIds, -1);
    }
    setTimeout(moveToNext, 1000);
  };
  const showCurrentRule = () => {
    if(currentQuestion?.text) Alert.alert("القاعدة الحالية", currentQuestion.text);
  };
  // --- (نهاية دوال الإجابات) ---

  const currentPlayer = players[currentPlayerIndex];
  const currentJudge = players[currentJudgeIndex];

  const renderActions = () => {
    // --- إضافة حالة جديدة للعبة "أنا لم أفعل قط" ---
    switch (gameCategory) {
      case 'neverHaveIEver':
        return (
          <View style={styles.actionsContainer}>
            <Text style={styles.instructionText}>كل من فعل هذا الشيء، يضغط على اسمه (تُخصم نقطة):</Text>
            <ScrollView>{players.map(player => { 
                const isSelected = mostLikelySelectedIds.includes(player.id); 
                return( 
                    <TouchableOpacity 
                        key={player.id} 
                        style={[styles.playerVoteButton, isSelected && styles.playerVoteButtonSelected]} 
                        onPress={() => handleMostLikelyToggle(player.id)}>
                        <Text style={[styles.playerVoteButtonText, isSelected && styles.buttonTextDark]}>{player.name}</Text>
                    </TouchableOpacity> 
                ); 
            })}</ScrollView>
             <TouchableOpacity style={[styles.actionButton, styles.successButton, {marginTop: 10}]} onPress={confirmNeverHaveIEver}>
                <Text style={styles.actionButtonText}>تأكيد والانتقال للسؤال التالي</Text>
            </TouchableOpacity>
          </View>
        );
      // ... (بقية الحالات كما هي)
      case 'general':
        return (
          <View style={styles.actionsContainer}>
            {currentQuestion?.options.map((option) => {
              const isCorrect = answered && option === answered.correct;
              const isWrong = answered && option === answered.selected && !isCorrect;
              let buttonStyle = [styles.optionButton];
              let textStyle = [styles.optionButtonText];
              if (isCorrect) { buttonStyle.push(styles.correctOption); textStyle.push(styles.buttonTextDark); } 
              else if (isWrong) { buttonStyle.push(styles.wrongOption); textStyle.push(styles.buttonText); } 
              else if (answered) { buttonStyle.push(styles.disabledOption); }
              return ( <TouchableOpacity key={option} style={buttonStyle} onPress={() => handleGeneralAnswer(option)} disabled={!!answered}><Text style={textStyle}>{option}</Text></TouchableOpacity> );
            })}
          </View>
        );
      case 'mostLikely':
        return (
          <View style={styles.actionsContainer}>
            <Text style={styles.instructionText}>اختر كل اللاعبين الذين تنطبق عليهم العبارة:</Text>
            <ScrollView>{players.map(player => { 
                const isSelected = mostLikelySelectedIds.includes(player.id); 
                return( 
                    <TouchableOpacity 
                        key={player.id} 
                        style={[styles.playerVoteButton, isSelected && styles.playerVoteButtonSelected]} 
                        onPress={() => handleMostLikelyToggle(player.id)}>
                        <Text style={[styles.playerVoteButtonText, isSelected && styles.buttonTextDark]}>{player.name}</Text>
                    </TouchableOpacity> 
                ); 
            })}</ScrollView>
             <TouchableOpacity style={[styles.actionButton, styles.successButton, {marginTop: 10}]} onPress={confirmMostLikely}>
                <Text style={styles.actionButtonText}>تأكيد والانتقال للسؤال التالي</Text>
            </TouchableOpacity>
          </View>
        );
      case 'confession':
      case 'challenge':
        const handleSuccessPress = () => { playSound('click'); handleConfessionChallengeOutcome(true); }; const handleFailPress = () => { playSound('click'); handleConfessionChallengeOutcome(false); };
        return (
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={[styles.actionButton, styles.successButton, (outcome === 'fail' && styles.disabledOption)]} onPress={handleSuccessPress} disabled={!!outcome}><Text style={styles.actionButtonText}>نجح / اعترف</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.failButton, (outcome === 'success' && styles.disabledOption)]} onPress={handleFailPress} disabled={!!outcome}><Text style={styles.actionButtonText}>فشل / رفض</Text></TouchableOpacity>
          </View>
        );
      case 'challengeMaster':
        return (
          <View style={styles.challengeMasterContainer}>
            <Text style={styles.instructionText}>أيها الحكم، اختر كل من خالف القاعدة:</Text>
            <View style={styles.playerGridContainer}>
              {players.map(player => {
                const isPenalized = penalizedPlayerIds.includes(player.id);
                const isDisabled = player.id === currentJudge.id;
                return (
                  <TouchableOpacity
                    key={player.id}
                    style={[ styles.playerGridItem, isPenalized && styles.playerGridItemSelected, isDisabled && styles.disabledOption ]}
                    onPress={() => !isDisabled && handleTogglePenalty(player.id)}
                    disabled={isDisabled}
                  >
                    <Text style={[ styles.playerGridItemText, isPenalized && styles.buttonTextDark, isDisabled && { color: theme.subtleText } ]}>
                      {player.name}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>
            <View style={styles.bottomActionsContainer}>
                <TouchableOpacity
                    style={[styles.halfWidthButton, { backgroundColor: theme.fail }, penalizedPlayerIds.length === 0 && styles.disabledOption]}
                    onPress={confirmPenalties}
                    disabled={penalizedPlayerIds.length === 0}
                >
                    <Text style={styles.halfWidthButtonText}>تأكيد العقوبات</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.halfWidthButton, {backgroundColor: theme.primary}]}
                    onPress={() => { playSound('click'); moveToNext(); }}
                >
                    <Text style={styles.halfWidthButtonText}>لا يوجد مخالفون</Text>
                </TouchableOpacity>
            </View>
          </View>
        );
      default: return null;
    }
  };

  const getInstructions = () => {
    let title = `شرح لعبة: ${gameTitle}`;
    let message = "";
    const judgeName = players[currentJudgeIndex]?.name || 'غير محدد';
    
    switch (gameCategory) {
      case 'neverHaveIEver': message = "تظهر عبارة تبدأ بـ 'أنا لم أفعل قط...'. كل لاعب قام بالفعل المذكور، يجب أن يضغط على اسمه. كل لاعب يتم اختياره تُخصم منه نقطة. الخاسر في النهاية هو صاحب أقل مجموع نقاط."; break;
      case 'general': message = "اللاعب الذي عليه الدور يجيب على سؤال من خيارات. الإجابة الصحيحة تكسب نقطة، والخاطئة تخصم نقطة."; break;
      case 'mostLikely': message = "تظهر عبارة على الشاشة. يقوم اللاعبون بالتصويت واختيار كل من تنطبق عليه العبارة. كل لاعب يتم اختياره تُخصم منه نقطة."; break;
      case 'confession': message = "اللاعب الذي عليه الدور يواجه سؤال اعتراف. إذا كان اعترافه صريحاً ووافق عليه اللاعبون، يحصل على نقطة. إذا رفض، تُخصم منه نقطة."; break;
      case 'challenge': message = "اللاعب الذي عليه الدور يواجه تحدياً. إذا نفذ التحدي بنجاح، يحصل على نقطة. إذا فشل، تُخصم منه نقطة."; break;
      case 'challengeMaster':
        message = `مرحباً بك في لعبة "الكل يلعب"! الحكم الحالي هو: ${judgeName}.\n\n` +
          "1. تظهر بطاقة في كل جولة تحتوي على قانون جديد ينطبق على **جميع اللاعبين**.\n" +
          "2. **الحكم** يراقب الجميع. إذا خالف أي لاعب القاعدة، يقوم الحكم باختياره لخصم نقطة منه.\n" +
          "3. دور 'الحكم' ينتقل إلى اللاعب التالي في كل جولة.";
        break;
      default: message = "لا يوجد شرح لهذا النوع من الألعاب.";
    }
    return { title, message };
  };

  if (gameState === 'loading') {
    return (
        <View style={styles.container}><Text style={styles.cardText}>جاري تحضير اللعبة...</Text></View>
    );
  }

  return (
    <View style={styles.container}>
      <PlayerHeader gameCategory={gameCategory} currentPlayer={currentPlayer} currentJudge={currentJudge} round={round} onRulePress={showCurrentRule} styles={styles} />
      {currentQuestion && <QuestionCard question={currentQuestion} styles={styles} />}
      {renderActions()}
      <InstructionsModal visible={isInstructionsVisible} onClose={() => setInstructionsVisible(false)} instructions={getInstructions()} styles={styles} />
    </View>
  );
};

// --- (الأنماط getStyles تبقى كما هي) ---
const getStyles = (COLORS) => StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SIZES.padding, justifyContent: 'space-between' },
  headerContainer: { alignItems: 'center' },
  roundText: { ...FONTS.body, color: COLORS.subtleText, marginBottom: SIZES.base },
  playerInfoContainer: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center' },
  judgeHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary, paddingHorizontal: SIZES.base * 2, paddingVertical: SIZES.base, borderRadius: SIZES.radius * 2, elevation: 5 },
  judgeNameText: { ...FONTS.h2, color: COLORS.buttonTextDark },
  playerTurnText: { ...FONTS.h3, color: COLORS.text, },
  currentPlayerName: { ...FONTS.h2, color: COLORS.primary, },
  playerScoreText: { ...FONTS.h3, color: COLORS.secondary, fontWeight: 'bold', },
  ruleIcon: { marginRight: SIZES.base, padding: 5 },
  cardContainer: {
    flexGrow: 1,
    maxHeight: height * 0.3,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius * 2,
    padding: SIZES.padding,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: SIZES.padding / 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
  },
  cardText: { ...FONTS.h3, color: COLORS.text, textAlign: 'center', lineHeight: SIZES.h3 * 1.5 },
  actionsContainer: { paddingBottom: SIZES.padding, minHeight: height * 0.25, justifyContent: 'center' },
  challengeMasterContainer: { flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingBottom: SIZES.padding },
  optionButton: { backgroundColor: 'transparent', borderWidth: 2, borderColor: COLORS.primary, padding: SIZES.padding / 1.5, borderRadius: SIZES.radius, marginVertical: SIZES.base, alignItems: 'center' },
  optionButtonText: { ...FONTS.h3, color: COLORS.text },
  correctOption: { backgroundColor: COLORS.success, borderColor: COLORS.success },
  wrongOption: { backgroundColor: COLORS.fail, borderColor: COLORS.fail },
  disabledOption: { opacity: 0.5 },
  buttonText: { color: COLORS.buttonText },
  buttonTextDark: { color: COLORS.buttonTextDark },
  playerVoteButton: { backgroundColor: 'transparent', borderWidth: 2, borderColor: COLORS.primary, padding: SIZES.padding / 1.5, borderRadius: SIZES.radius, marginVertical: SIZES.base, alignItems: 'center' },
  playerVoteButtonSelected: { backgroundColor: COLORS.secondary, borderColor: COLORS.secondary },
  playerVoteButtonText: { ...FONTS.button, color: COLORS.text },
  playerGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    flexGrow: 1,
    marginTop: SIZES.base,
  },
  playerGridItem: {
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: SIZES.radius,
    paddingVertical: SIZES.base,
    margin: SIZES.base / 3,
    alignItems: 'center',
    justifyContent: 'center',
    width: '46%',
    minHeight: 50,
  },
  playerGridItemSelected: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  playerGridItemText: {
    ...FONTS.body,
    fontWeight: 'bold',
    color: COLORS.text,
    fontSize: SIZES.body - 2,
    textAlign: 'center',
  },
  instructionText: { ...FONTS.body, color: COLORS.subtleText, textAlign: 'center', marginBottom: SIZES.base },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.8)' },
  modalContent: { width: '90%', maxHeight: '80%', backgroundColor: COLORS.surface, borderRadius: SIZES.radius, padding: SIZES.padding, borderColor: COLORS.primary, borderWidth: 1},
  modalTitle: { ...FONTS.h2, color: COLORS.primary, marginBottom: SIZES.base, textAlign: 'center' },
  modalMessage: { ...FONTS.body, color: COLORS.text, marginVertical: SIZES.padding / 2, lineHeight: SIZES.body * 1.6 },
  modalCloseButton: { backgroundColor: COLORS.primary, padding: SIZES.padding / 1.5, borderRadius: SIZES.radius, marginTop: SIZES.padding, alignItems: 'center' },
  modalCloseButtonText: { ...FONTS.button, color: COLORS.buttonTextDark },
  bottomActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: SIZES.base,
  },
  halfWidthButton: {
    width: '48%',
    padding: SIZES.padding / 1.5,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  halfWidthButtonText: {
    ...FONTS.button,
    color: COLORS.buttonText,
    fontSize: SIZES.body,
    textAlign: 'center'
  },
  actionButton: {
    padding: SIZES.padding,
    borderRadius: SIZES.radius * 2,
    marginVertical: SIZES.base,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  actionButtonText: {
    ...FONTS.button,
    color: COLORS.buttonTextDark,
  },
  successButton: {
    backgroundColor: COLORS.primary,
  },
  failButton: {
    backgroundColor: COLORS.fail,
  },
});

export default GameScreen;