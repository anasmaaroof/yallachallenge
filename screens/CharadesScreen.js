import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Alert, Animated } from 'react-native';
import { usePlayers } from '../contexts/PlayersContext';
import { useSettings } from '../contexts/SettingsContext';
import { useSound } from '../contexts/SoundContext';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { getNextCharadesWord, resetCharadesWordsProgressIndex } from '../data/charadesWords';

const useAnimatedWord = (word) => {
    const scaleAnim = useRef(new Animated.Value(0.7)).current;
    useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            useNativeDriver: true,
        }).start();
    }, [word]);
    return scaleAnim;
};

const CharadesScreen = ({ navigation }) => {
    const { players: initialPlayers, updatePlayerScore } = usePlayers();
    const { settings } = useSettings();
    const { playSound } = useSound();

    const [players, setPlayers] = useState(initialPlayers.map(p => ({ ...p, score: p.score || 0 })));
    const [gameState, setGameState] = useState('loading');
    const [currentWord, setCurrentWord] = useState(null);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [round, setRound] = useState(1);
    const [showCelebration, setShowCelebration] = useState(false);

    // تعليمات اللعبة
    const [showInstructions, setShowInstructions] = useState(true);

    // جلب الكلمة التالية دون تكرار حتى نهاية جميع الكلمات
    const getWord = async () => {
        let nextWord = await getNextCharadesWord();
        if (!nextWord) {
            Alert.alert("تهانينا!", "لقد لعبتم كل الكلمات المتاحة. سيتم الآن إعادة تعيين القائمة.");
            await resetCharadesWordsProgressIndex();
            nextWord = await getNextCharadesWord();
        }
        setCurrentWord(nextWord);
    };

    useEffect(() => {
        const initializeGame = async () => {
            await getWord();
            setGameState('ready');
        };
        initializeGame();
    }, []);

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

    // احتفال عند الإجابة الصحيحة
    const triggerCelebration = () => {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 1200);
    };

    const handleCorrectGuess = (guesserId) => {
        playSound('correct');
        triggerCelebration();
        handleScoreUpdate([currentPlayer.id, guesserId], 1);
        setTimeout(nextTurn, 600);
    };

    const handleFailedGuess = () => {
        playSound('wrong');
        handleScoreUpdate(currentPlayer.id, -1);
        setTimeout(nextTurn, 600);
    };

    const endGame = () => {
        navigation.replace('Result', { players, gameCategory: 'charades' });
    };

    const nextTurn = async () => {
        const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
        if (nextPlayerIndex === 0) {
            const nextRound = round + 1;
            if (nextRound > settings.numberOfRounds) {
                endGame();
                return;
            }
            setRound(nextRound);
        }
        setCurrentPlayerIndex(nextPlayerIndex);
        setGameState('ready');
        await getWord();
    };

    const currentPlayer = players[currentPlayerIndex];
    const wordAnim = useAnimatedWord(currentWord?.text);

    const renderRoundBar = () => (
        <View style={styles.roundBar}>
            <Text style={styles.roundText}>الجولة <Text style={{ color: COLORS.primary }}>{round}</Text> / {settings.numberOfRounds}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 4 }}>
                {players.map((p, i) => (
                    <View key={p.id} style={[styles.playerChip, i === currentPlayerIndex && styles.currentChip]}>
                        <Text style={[styles.playerChipText, i === currentPlayerIndex && { color: COLORS.primary }]}>{p.name}</Text>
                        <Text style={[styles.playerChipScore, i === currentPlayerIndex && { color: COLORS.primary }]}>{p.score}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );

    const renderCelebration = () => showCelebration && (
        <View style={styles.celebrationOverlay}>
            <Text style={styles.celebrationText}>🎉 أحسنت! 🎉</Text>
        </View>
    );

    const renderReadyScreen = () => (
        <View style={styles.centeredView}>
            {renderRoundBar()}
            <Text style={styles.playerTurnText}>استعد يا <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>{currentPlayer.name}</Text>!</Text>
            <Text style={styles.instructionText}>هل أنت جاهز لترى كلمتك وتبدأ التمثيل؟</Text>
            <TouchableOpacity style={styles.primaryButton} onPress={() => { playSound('click'); setGameState('acting'); }}>
                <Text style={styles.primaryButtonText}>أنا جاهز، اعرض الكلمة</Text>
            </TouchableOpacity>
        </View>
    );

    const renderActingScreen = () => (
        <View style={styles.centeredView}>
            {renderRoundBar()}
            <Text style={styles.titleText}>مثل الكلمة التالية:</Text>
            <Animated.View style={[styles.card, { transform: [{ scale: wordAnim }] }]}>
                <Text style={styles.wordText}>{currentWord?.text}</Text>
            </Animated.View>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => { playSound('click'); setGameState('guessing'); }}>
                <Text style={styles.secondaryButtonText}>تم تخمين الكلمة</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.secondaryButton, { backgroundColor: 'transparent', borderColor: COLORS.fail, borderWidth: 2 }]} onPress={handleFailedGuess}>
                <Text style={[styles.secondaryButtonText, { color: COLORS.fail }]}>لم يتمكن أحد (خصم نقطة)</Text>
            </TouchableOpacity>
            {renderCelebration()}
        </View>
    );

    const renderGuessingScreen = () => (
        <Modal visible={true} transparent={true} animationType="fade">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>من هو اللاعب الذي خمن الكلمة؟</Text>
                    <ScrollView>
                        {players.filter((p) => p.id !== currentPlayer.id).map((player) => (
                            <TouchableOpacity key={player.id} style={styles.playerVoteButton} onPress={() => handleCorrectGuess(player.id)}>
                                <Text style={styles.playerVoteButtonText}>{player.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <TouchableOpacity style={{ marginTop: 10 }} onPress={() => setGameState('acting')}>
                        <Text style={{ textAlign: 'center', color: COLORS.subtleText }}>إلغاء</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    // تعليمات اللعبة في أول مرة
    const renderInstructionsModal = () => (
        <Modal visible={showInstructions} animationType="slide" transparent>
            <View style={styles.modalContainer}>
                <View style={styles.instructionsContent}>
                    <Text style={styles.instructionsTitle}>شرح لعبة التمثيل الصامت 🎭</Text>
                    <ScrollView>
                        <Text style={styles.instructionsText}>
                            - كل جولة، سيظهر اسم لاعب يجب عليه تمثيل الكلمة المعروضة بدون أي كلام أو صوت! {"\n"}
                            - بقية اللاعبين يحاولون تخمين الكلمة. أول من يخمنها يحصل على نقطة مع الممثل. {"\n"}
                            - إذا لم يتمكن أحد من التخمين، يخسر اللاعب الممثل نقطة. {"\n"}
                            - اللعبة فيها عدة جولات، والفائز من يحصل على أكبر عدد من النقاط. {"\n"}
                            {"\n"}استمتعوا!
                        </Text>
                    </ScrollView>
                    <TouchableOpacity style={styles.instructionsButton} onPress={() => setShowInstructions(false)}>
                        <Text style={styles.instructionsButtonText}>فهمت، لنبدأ!</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    if (gameState === 'loading' || !currentPlayer) {
        return (
            <View style={styles.centeredView}>
                <Text style={styles.instructionText}>جاري تحضير اللعبة...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {gameState === 'ready' && renderReadyScreen()}
            {gameState === 'acting' && renderActingScreen()}
            {gameState === 'guessing' && renderGuessingScreen()}
            <TouchableOpacity style={styles.endGameButton} onPress={endGame}>
                <Text style={styles.endGameButtonText}>إنهاء اللعبة الآن</Text>
            </TouchableOpacity>
            {renderInstructionsModal()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: SIZES.padding,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    roundBar: {
        width: '98%',
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radius,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginBottom: SIZES.base,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 3,
        elevation: 2,
    },
    roundText: {
        ...FONTS.body,
        color: COLORS.subtleText,
        fontWeight: 'bold',
        marginBottom: 3,
    },
    playerChip: {
        backgroundColor: COLORS.surface,
        borderRadius: 22,
        marginRight: 8,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderWidth: 1,
        borderColor: COLORS.border,
        minWidth: 50,
        justifyContent: 'space-between',
    },
    currentChip: {
        backgroundColor: COLORS.primaryLight,
        borderColor: COLORS.primary,
    },
    playerChipText: {
        ...FONTS.body,
        marginRight: 4,
    },
    playerChipScore: {
        ...FONTS.body,
        fontWeight: 'bold',
    },
    titleText: {
        ...FONTS.h2,
        color: COLORS.subtleText,
        position: 'absolute',
        top: SIZES.padding,
        width: '100%',
        textAlign: 'center',
    },
    playerTurnText: {
        ...FONTS.h1,
        color: COLORS.primary,
        marginBottom: SIZES.base,
        textAlign: 'center',
    },
    instructionText: {
        ...FONTS.body,
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: SIZES.padding * 2,
        width: '80%',
    },
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radius * 2,
        padding: SIZES.padding * 2,
        marginVertical: SIZES.padding,
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 8,
    },
    wordText: {
        ...FONTS.h1,
        fontWeight: 'bold',
        color: COLORS.primary,
        textAlign: 'center',
        letterSpacing: 2,
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
        padding: SIZES.padding,
        borderRadius: SIZES.radius,
        width: '90%',
        alignItems: 'center',
        marginTop: SIZES.base,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 4,
    },
    primaryButtonText: {
        ...FONTS.button,
        color: COLORS.onPrimary,
        fontWeight: 'bold',
        fontSize: SIZES.h3,
    },
    secondaryButton: {
        backgroundColor: COLORS.success,
        padding: SIZES.padding / 1.5,
        borderRadius: SIZES.radius,
        width: '90%',
        alignItems: 'center',
        marginTop: SIZES.padding,
    },
    secondaryButtonText: {
        ...FONTS.button,
        fontSize: SIZES.body,
        color: COLORS.onSuccess,
    },
    endGameButton: {
        padding: SIZES.base,
        alignSelf: 'center',
        marginBottom: SIZES.base,
    },
    endGameButtonText: {
        ...FONTS.body,
        color: COLORS.subtleText,
        textDecorationLine: 'underline',
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    modalContent: {
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radius,
        padding: SIZES.padding,
        width: '85%',
        maxHeight: '70%',
    },
    modalTitle: {
        ...FONTS.h2,
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: SIZES.padding,
    },
    playerVoteButton: {
        backgroundColor: COLORS.primary,
        padding: SIZES.padding / 1.5,
        borderRadius: SIZES.radius,
        marginVertical: SIZES.base,
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    playerVoteButtonText: {
        ...FONTS.button,
        color: COLORS.onPrimary,
        fontWeight: 'bold',
    },
    celebrationOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    celebrationText: {
        ...FONTS.h1,
        color: COLORS.primary,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: SIZES.h1 * 1.2,
        shadowColor: COLORS.primary,
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 15,
    },
    instructionsContent: {
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radius,
        padding: SIZES.padding,
        width: '85%',
        maxHeight: '70%',
        alignItems: 'center',
    },
    instructionsTitle: {
        ...FONTS.h2,
        color: COLORS.primary,
        textAlign: 'center',
        marginBottom: SIZES.base * 1.5,
        fontWeight: 'bold',
    },
    instructionsText: {
        ...FONTS.body,
        color: COLORS.text,
        fontSize: SIZES.h3,
        textAlign: 'center',
        marginBottom: SIZES.base,
        lineHeight: SIZES.h3 * 1.5,
    },
    instructionsButton: {
        backgroundColor: COLORS.primary,
        padding: SIZES.padding,
        borderRadius: SIZES.radius,
        width: '90%',
        alignItems: 'center',
        marginTop: SIZES.base,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 4,
    },
    instructionsButtonText: {
        ...FONTS.button,
        color: COLORS.onPrimary,
        fontWeight: 'bold',
        fontSize: SIZES.h3,
    },
});

export default CharadesScreen;