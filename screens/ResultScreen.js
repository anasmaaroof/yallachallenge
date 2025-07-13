// screens/ResultScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme'; 

const ResultScreen = ({ navigation, route }) => {
  const { players, gameCategory } = route.params; 
  const [loser, setLoser] = useState(null);
  const [sortedPlayers, setSortedPlayers] = useState([]);

  useEffect(() => {
    if (players && players.length > 0) {
      const sorted = [...players].sort((a, b) => a.score - b.score);
      const winnerSorted = [...sorted].reverse();
      setSortedPlayers(winnerSorted);
      const minScore = sorted[0].score;
      const potentialLosers = sorted.filter(player => player.score === minScore);
      
      if (potentialLosers.length === 1) {
        setLoser(potentialLosers[0]);
      } else {
        setLoser({ name: potentialLosers.map(p => p.name).join(' و '), id: 'tie' });
      }
    }
  }, [players, gameCategory]);

  const handlePunish = () => {
    if (loser) {
      navigation.replace('Punishment', { loserName: loser.name }); 
    } else {
      navigation.popToTop();
    }
  };

  const renderPlayerItem = ({ item, index }) => (
    <View style={styles.playerScoreItem}>
      <Text style={styles.playerRank}>{index === 0 ? '🏆' : `${index + 1}.`}</Text>
      <Text style={styles.playerName}>{item.name}</Text>
      <Text style={styles.playerScore}>{item.score} نقاط</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>النتائج النهائية</Text>

      <FlatList
        data={sortedPlayers}
        keyExtractor={item => item.id}
        renderItem={renderPlayerItem}
        style={styles.playerList}
      />

      {loser && (
        <View style={styles.loserContainer}>
          <Text style={styles.loserText}>الخاسر هو</Text>
          <Text style={styles.loserName}>{loser.name}</Text>
          <TouchableOpacity style={styles.punishButton} onPress={handlePunish}>
            <Text style={styles.punishButtonText}>😈 عرض العقوبة</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={styles.playAgainButton}
        onPress={() => navigation.popToTop()}
      >
        <Text style={styles.playAgainButtonText}>العب مرة أخرى</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SIZES.padding,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.primary,
    marginBottom: SIZES.padding,
  },
  playerList: {
    width: '100%',
    flexGrow: 0, 
    maxHeight: '40%',
  },
  playerScoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: SIZES.base * 1.5,
    paddingHorizontal: SIZES.base * 2,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  playerRank: {
    ...FONTS.h3,
    color: COLORS.subtleText,
    marginRight: SIZES.base * 1.5,
  },
  playerName: {
    flex: 1,
    ...FONTS.h3,
    color: COLORS.text,
  },
  playerScore: {
    ...FONTS.h3,
    color: COLORS.primary,
  },
  loserContainer: {
    width: '90%',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SIZES.padding,
    borderRadius: SIZES.radius * 2,
    marginTop: SIZES.padding,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },
  loserText: {
    ...FONTS.h2,
    color: COLORS.secondary,
    marginBottom: SIZES.base,
  },
  loserName: {
    ...FONTS.h1,
    color: COLORS.secondary,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SIZES.padding,
  },
  punishButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: SIZES.base * 1.5,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
    width: '100%',
    alignItems: 'center',
  },
  punishButtonText: {
    ...FONTS.button,
  },
  playAgainButton: {
    backgroundColor: 'transparent',
    paddingVertical: SIZES.base * 1.5,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
    marginTop: SIZES.padding,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  playAgainButtonText: {
    ...FONTS.h3,
    color: COLORS.primary,
  },
});

export default ResultScreen;