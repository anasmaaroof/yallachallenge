import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated
} from 'react-native';

import { usePlayers } from '../contexts/PlayersContext';
import { COLORS, FONTS, SIZES } from '../constants/theme';

const PlayerInputScreen = ({ navigation }) => {
  const { players, addPlayer, removePlayer, resetPlayerScores } = usePlayers();
  const [playerName, setPlayerName] = useState('');
  const [shakeAnim] = useState(new Animated.Value(0));

  // مؤثر بصري عند محاولة إضافة اسم فارغ أو مكرر
  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 4, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleAddPlayer = () => {
    const result = addPlayer(playerName.trim());
    if (result.success) {
      setPlayerName('');
    } else {
      triggerShake();
      Alert.alert('خطأ', result.message);
    }
  };

  const handleRemovePlayer = (id) => {
    Alert.alert(
      "حذف لاعب",
      "هل أنت متأكد أنك تريد حذف هذا اللاعب؟",
      [
        { text: "إلغاء", style: "cancel" },
        { text: "نعم", onPress: () => removePlayer(id) }
      ]
    );
  };

  const startGame = () => {
    if (players.length < 2) {
      triggerShake();
      Alert.alert('عدد اللاعبين غير كافٍ', 'يجب أن يكون هناك لاعبان على الأقل لبدء اللعبة.');
      return;
    }
    resetPlayerScores();
    navigation.navigate('GameType');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        {/* --- عنوان الصفحة مع أيقونة لاعبين --- */}
        <Text style={styles.title}>
          <Text style={{ fontSize: SIZES.h1 * 1.5 }}>👥</Text> إضافة اللاعبين
        </Text>

        {/* --- قسم الإدخال مع مؤثر بصري --- */}
        <Animated.View style={[styles.inputContainer, { transform: [{ translateX: shakeAnim }] }]}>
          <TextInput
            style={styles.input}
            placeholder="أدخل اسم اللاعب"
            placeholderTextColor={COLORS.subtleText}
            value={playerName}
            onChangeText={setPlayerName}
            maxLength={20}
            onSubmitEditing={handleAddPlayer}
            autoCorrect={false}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={[styles.addButton, playerName.trim() === '' && styles.addButtonDisabled]}
            onPress={handleAddPlayer}
            disabled={playerName.trim() === ''}
            activeOpacity={playerName.trim() === '' ? 1 : 0.7}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* --- قائمة اللاعبين --- */}
        <FlatList
          data={players}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => (
            <View style={[styles.playerItem, index % 2 === 0 ? styles.playerItemEven : styles.playerItemOdd]}>
              <Text style={styles.playerName}>{item.name}</Text>
              <TouchableOpacity onPress={() => handleRemovePlayer(item.id)}>
                <Text style={styles.removeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
          style={styles.playerList}
          ListEmptyComponent={
            <Text style={styles.listEmptyText}>لا يوجد لاعبون بعد، أضف أول لاعب للبدء.</Text>
          }
        />

        {/* --- زر بدء اللعبة --- */}
        <TouchableOpacity
          style={[styles.startButton, players.length < 2 && styles.startButtonDisabled]}
          onPress={startGame}
          disabled={players.length < 2}
        >
          <Text style={styles.startButtonText}>
            {players.length < 2 ? "أضف لاعبين أولاً" : "التالي"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  innerContainer: {
    flex: 1,
    padding: SIZES.padding,
    justifyContent: 'flex-start',
  },
  title: {
    ...FONTS.h1,
    color: COLORS.primary,
    textAlign: 'center',
    marginVertical: SIZES.base * 2,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: SIZES.padding,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.surface,
    ...FONTS.body,
    color: COLORS.text,
    height: 50,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.base * 2,
    marginRight: SIZES.base,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  addButton: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.14,
    shadowRadius: 4,
    elevation: 2,
  },
  addButtonDisabled: {
    backgroundColor: COLORS.subtleText,
  },
  addButtonText: {
    ...FONTS.h1,
    color: COLORS.surface,
    marginTop: -4,
    fontWeight: 'bold',
    fontSize: SIZES.h2,
  },
  playerList: {
    flex: 1,
    marginTop: SIZES.base,
    marginBottom: SIZES.base * 2,
  },
  playerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SIZES.base * 2,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  playerItemEven: {
    backgroundColor: COLORS.surface,
  },
  playerItemOdd: {
    backgroundColor: COLORS.surface + 'CC',
  },
  playerName: {
    ...FONTS.h3,
    color: COLORS.text,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  removeButtonText: {
    ...FONTS.body,
    color: COLORS.fail,
    fontWeight: 'bold',
    fontSize: SIZES.h2,
  },
  listEmptyText: {
    ...FONTS.body,
    color: COLORS.subtleText,
    textAlign: 'center',
    marginTop: SIZES.padding * 2,
  },
  startButton: {
    backgroundColor: COLORS.primary,
    padding: SIZES.padding / 1.5,
    borderRadius: SIZES.radius * 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.13,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: SIZES.base * 2,
  },
  startButtonDisabled: {
    backgroundColor: COLORS.subtleText,
    shadowColor: COLORS.subtleText,
  },
  startButtonText: {
    ...FONTS.button,
    fontWeight: 'bold',
    color: COLORS.onPrimary,
    fontSize: SIZES.h3,
    letterSpacing: 1,
  },
});

export default PlayerInputScreen;