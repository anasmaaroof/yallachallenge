// screens/PlayerInputScreen.js

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
  Platform
} from 'react-native';

import { usePlayers } from '../contexts/PlayersContext';
import { COLORS, FONTS, SIZES } from '../constants/theme'; // استيراد الثيم

const PlayerInputScreen = ({ navigation }) => {
  const { players, addPlayer, removePlayer, resetPlayerScores } = usePlayers();
  const [playerName, setPlayerName] = useState('');

  const handleAddPlayer = () => {
    const result = addPlayer(playerName);
    if (result.success) {
      setPlayerName('');
    } else {
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
        {/* --- قسم الإدخال --- */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="أدخل اسم اللاعب"
            placeholderTextColor={COLORS.subtleText}
            value={playerName}
            onChangeText={setPlayerName}
            maxLength={20}
            onSubmitEditing={handleAddPlayer}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddPlayer}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* --- قائمة اللاعبين --- */}
        <FlatList
          data={players}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.playerItem}>
              <Text style={styles.playerName}>{item.name}</Text>
              <TouchableOpacity onPress={() => handleRemovePlayer(item.id)}>
                <Text style={styles.removeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
          style={styles.playerList}
          ListEmptyComponent={<Text style={styles.listEmptyText}>لا يوجد لاعبون بعد.</Text>}
        />

        {/* --- زر بدء اللعبة --- */}
        <TouchableOpacity
          style={[styles.startButton, players.length < 2 && styles.startButtonDisabled]}
          onPress={startGame}
          disabled={players.length < 2}
        >
          <Text style={styles.startButtonText}>التالي</Text>
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
  },
  addButtonText: {
    ...FONTS.h1,
    color: COLORS.surface,
    marginTop: -4 // لضبط علامة + في المنتصف
  },
  playerList: {
    flex: 1,
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
  playerName: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  removeButtonText: {
    ...FONTS.body,
    color: COLORS.secondary,
    fontWeight: 'bold',
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
    marginTop: SIZES.base,
  },
  startButtonDisabled: {
    backgroundColor: COLORS.subtleText, // لون مختلف عند تعطيل الزر
  },
  startButtonText: {
    ...FONTS.button,
  },
});

export default PlayerInputScreen;