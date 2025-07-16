import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Animated } from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';

const ResultScreen = ({ navigation, route }) => {
  const { players, gameCategory } = route.params;
  const [loser, setLoser] = useState(null);
  const [sortedPlayers, setSortedPlayers] = useState([]);
  const cardAnim = useRef(new Animated.Value(0)).current;

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

      // Animate loser card when results calculated
      Animated.spring(cardAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }).start();
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
    <View style={[
      styles.playerScoreItem,
      index === 0 && styles.topPlayerScoreItem,
      index === sortedPlayers.length - 1 && styles.lastPlayerScoreItem,
    ]}>
      <Text style={[
        styles.playerRank,
        index === 0 && styles.topPlayerRank
      ]}>
        {index === 0 ? '🏆' : `${index + 1}.`}
      </Text>
      <Text style={[
        styles.playerName,
        index === 0 && styles.topPlayerName
      ]}>
        {item.name}
      </Text>
      <Text style={[
        styles.playerScore,
        index === 0 && styles.topPlayerScore
      ]}>
        {item.score} نقاط
      </Text>
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
        <Animated.View
          style={[
            styles.loserContainer,
            {
              transform: [
                { scale: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }
              ],
              shadowOpacity: 0.14,
            }
          ]}
        >
          <Text style={styles.loserText}>الخاسر هو</Text>
          <Text style={styles.loserName}>
            <Text style={{ fontSize: SIZES.h1 * 1.2 }}>😅 </Text>
            {loser.name}
          </Text>
          <TouchableOpacity style={styles.punishButton} onPress={handlePunish}>
            <Text style={styles.punishButtonText}>😈 عرض العقوبة</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <TouchableOpacity
        style={styles.playAgainButton}
        onPress={() => navigation.popToTop()}
      >
        <Text style={styles.playAgainButtonText}>🔄 العب مرة أخرى</Text>
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
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
  playerList: {
    width: '100%',
    flexGrow: 0,
    maxHeight: '45%',
    marginBottom: SIZES.base * 2,
  },
  playerScoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: SIZES.base * 1.4,
    paddingHorizontal: SIZES.base * 2,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base,
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  topPlayerScoreItem: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  lastPlayerScoreItem: {
    backgroundColor: COLORS.fail + '22',
  },
  playerRank: {
    ...FONTS.h3,
    color: COLORS.subtleText,
    marginRight: SIZES.base * 1.5,
    fontWeight: 'bold',
  },
  topPlayerRank: {
    color: COLORS.primary,
    fontSize: SIZES.h2,
  },
  playerName: {
    flex: 1,
    ...FONTS.h3,
    color: COLORS.text,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  topPlayerName: {
    color: COLORS.primary,
    fontSize: SIZES.h2,
  },
  playerScore: {
    ...FONTS.h3,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  topPlayerScore: {
    color: COLORS.primary,
    fontSize: SIZES.h2,
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
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: COLORS.fail,
  },
  loserText: {
    ...FONTS.h2,
    color: COLORS.fail,
    marginBottom: SIZES.base,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  loserName: {
    ...FONTS.h1,
    color: COLORS.fail,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SIZES.padding,
    letterSpacing: 1,
  },
  punishButton: {
    backgroundColor: COLORS.fail,
    paddingVertical: SIZES.base * 1.5,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
    width: '100%',
    alignItems: 'center',
    marginTop: SIZES.base,
    shadowColor: COLORS.fail,
    shadowOpacity: 0.14,
    shadowRadius: 6,
    elevation: 2,
  },
  punishButtonText: {
    ...FONTS.button,
    color: COLORS.onPrimary,
    fontWeight: 'bold',
    fontSize: SIZES.h3,
    letterSpacing: 1,
  },
  playAgainButton: {
    backgroundColor: 'transparent',
    paddingVertical: SIZES.base * 1.5,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
    marginTop: SIZES.padding,
    borderWidth: 2,
    borderColor: COLORS.primary,
    width: '80%',
    alignItems: 'center',
  },
  playAgainButtonText: {
    ...FONTS.h3,
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: SIZES.h3,
    letterSpacing: 1,
  },
});

export default ResultScreen;