// screens/CharadesScreen.js

import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePlayers } from '../contexts/PlayersContext';
import { useSettings } from '../contexts/SettingsContext';
import { useSound } from '../contexts/SoundContext';
import { COLORS, FONTS, SIZES } from '../constants/theme';

const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
};

const USED_WORDS_KEY = '@charades_used_words';

const CharadesScreen = ({ navigation, route }) => {
    const { words } = route.params;
    const { players: initialPlayers, updatePlayerScore } = usePlayers();
    const { settings } = useSettings();
    const { playSound } = useSound();

    const [players, setPlayers] = useState(initialPlayers.map((p) => ({ ...p, score: p.score || 0 })));
    const [gameState, setGameState] = useState('loading');
    const [currentWord, setCurrentWord] = useState(null);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [round, setRound] = useState(1);
    
    const wordPoolRef = useRef([]);

    const markWordAsUsed = async (wordId) => {
        try {
            const existingUsedWords = await AsyncStorage.getItem(USED_WORDS_KEY);
            const usedWords = existingUsedWords ? JSON.parse(existingUsedWords) : [];
            usedWords.push(wordId);
            await AsyncStorage.setItem(USED_WORDS_KEY, JSON.stringify(usedWords));
        } catch (e) {
            console.error("Failed to save used word.", e);
        }
    };

    useEffect(() => {
        const initializeGame = async () => {
            try {
                const usedWordsJson = await AsyncStorage.getItem(USED_WORDS_KEY);
                const usedWordIds = usedWordsJson ? JSON.parse(usedWordsJson) : [];
                
                // نفترض أن كل كلمة الآن هي كائن {id, text}
                const wordsAsObjects = words.map((word, index) => ({ id: `cw_${index}`, text: word }));
                let availableWords = wordsAsObjects.filter(w => !usedWordIds.includes(w.id));

                if (availableWords.length === 0) {
                    Alert.alert("تهانينا!", "لقد لعبتم كل الكلمات المتاحة. سيتم الآن إعادة تعيين القائمة.");
                    await AsyncStorage.removeItem(USED_WORDS_KEY);
                    availableWords = [...wordsAsObjects];
                }
                
                wordPoolRef.current = shuffleArray(availableWords);
                setGameState('ready');
                getNextWord();

            } catch (e) {
                console.error("Failed to initialize game.", e);
                const wordsAsObjects = words.map((word, index) => ({ id: `cw_${index}`, text: word }));
                wordPoolRef.current = shuffleArray(wordsAsObjects);
                setGameState('ready');
            }
        };

        initializeGame();
    }, []);
    
    const getNextWord = () => {
        if (wordPoolRef.current.length === 0) {
            endGame();
            return;
        }
        const nextWord = wordPoolRef.current.pop();
        setCurrentWord(nextWord);
        markWordAsUsed(nextWord.id);
    };

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

    const handleCorrectGuess = (guesserId) => {
        playSound('correct');
        handleScoreUpdate([currentPlayer.id, guesserId], 1);
        setTimeout(nextTurn, 300);
    };

    const handleFailedGuess = () => {
        playSound('wrong');
        handleScoreUpdate(currentPlayer.id, -1);
        setTimeout(nextTurn, 300);
    };

    const endGame = () => {
        navigation.replace('Result', { players, gameCategory: 'charades' });
    };

    const nextTurn = () => {
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
        getNextWord();
    };

    const currentPlayer = players[currentPlayerIndex];

    if (gameState === 'loading' || !currentPlayer) {
        return (
            <View style={styles.centeredView}>
                <Text style={styles.instructionText}>جاري تحضير اللعبة...</Text>
            </View>
        );
    }
    
    const renderReadyScreen = () => (
        <View style={styles.centeredView}>
            <Text style={styles.titleText}>الجولة {round}</Text>
            <Text style={styles.playerTurnText}>استعد يا {currentPlayer.name}!</Text>
            <Text style={styles.instructionText}>هل أنت جاهز لترى كلمتك وتبدأ التمثيل؟</Text>
            <TouchableOpacity style={styles.primaryButton} onPress={() => { playSound('click'); setGameState('acting'); }}>
                <Text style={styles.primaryButtonText}>أنا جاهز، اعرض الكلمة</Text>
            </TouchableOpacity>
        </View>
    );

    const renderActingScreen = () => (
        <View style={styles.centeredView}>
            <Text style={styles.titleText}>مثل الكلمة التالية:</Text>
            <View style={styles.card}>
                <Text style={styles.wordText}>{currentWord?.text}</Text>
            </View>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => { playSound('click'); setGameState('guessing'); }}>
                <Text style={styles.secondaryButtonText}>تم تخمين الكلمة</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.secondaryButton, { backgroundColor: 'transparent', borderColor: COLORS.fail, borderWidth: 2 }]} onPress={handleFailedGuess}>
                <Text style={[styles.secondaryButtonText, { color: COLORS.fail }]}>لم يتمكن أحد (خصم نقطة)</Text>
            </TouchableOpacity>
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

    return (
        <View style={styles.container}>
            {gameState === 'ready' && renderReadyScreen()}
            {gameState === 'acting' && renderActingScreen()}
            {gameState === 'guessing' && renderGuessingScreen()}
            <TouchableOpacity style={styles.endGameButton} onPress={endGame}>
                <Text style={styles.endGameButtonText}>إنهاء اللعبة الآن</Text>
            </TouchableOpacity>
        </View>
    );
};

// ... الأنماط styles تبقى كما هي
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
    titleText: {
        ...FONTS.h2,
        color: COLORS.subtleText,
        position: 'absolute',
        top: SIZES.padding,
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
        color: COLORS.text,
        textAlign: 'center',
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
        padding: SIZES.padding,
        borderRadius: SIZES.radius,
        width: '90%',
        alignItems: 'center',
    },
    primaryButtonText: {
        ...FONTS.button,
    },
    secondaryButton: {
        backgroundColor: '#2e7d32',
        padding: SIZES.padding / 1.5,
        borderRadius: SIZES.radius,
        width: '90%',
        alignItems: 'center',
        marginTop: SIZES.padding,
    },
    secondaryButtonText: {
        ...FONTS.button,
        fontSize: SIZES.body,
    },
    endGameButton: {
        padding: SIZES.base,
        alignSelf: 'center',
    },
    endGameButtonText: {
        ...FONTS.body,
        color: COLORS.subtleText,
        textDecorationLine: 'underline',
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
    },
    playerVoteButtonText: {
        ...FONTS.button,
    }
});

export default CharadesScreen;