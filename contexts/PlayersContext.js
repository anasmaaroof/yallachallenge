import React, { createContext, useState, useContext, useCallback, useMemo, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PLAYERS_KEY = '@yalla_challenge_players';

const PlayersContext = createContext();

export const PlayersProvider = ({ children }) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  // تحميل قائمة اللاعبين عند بدء التطبيق (للاستمرارية بين الجلسات)
  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const savedPlayers = await AsyncStorage.getItem(PLAYERS_KEY);
        if (savedPlayers) {
          setPlayers(JSON.parse(savedPlayers));
        }
      } catch (e) {
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    };
    loadPlayers();
  }, []);

  // حفظ القائمة في AsyncStorage كلما تغيرت
  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
    }
  }, [players, loading]);

  // إضافة لاعب جديد
  const addPlayer = useCallback((name) => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return { success: false, message: 'الرجاء إدخال اسم اللاعب.' };
    }
    if (players.length >= 8) {
      return { success: false, message: 'لا يمكن إضافة أكثر من 8 لاعبين.' };
    }
    if (players.find(p => p.name === trimmedName)) {
      return { success: false, message: 'اسم اللاعب مكرر.' };
    }
    const newPlayer = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 7),
      name: trimmedName,
      score: 0
    };
    setPlayers(prev => [...prev, newPlayer]);
    return { success: true };
  }, [players]);

  // حذف لاعب
  const removePlayer = useCallback((id) => {
    setPlayers(prev => prev.filter(player => player.id !== id));
  }, []);

  // مسح جميع اللاعبين
  const clearPlayers = useCallback(() => {
    setPlayers([]);
    AsyncStorage.removeItem(PLAYERS_KEY);
  }, []);

  // تصفير النقاط فقط
  const resetPlayerScores = useCallback(() => {
    setPlayers(prev => prev.map(player => ({ ...player, score: 0 })));
  }, []);

  // تحديث نقاط لاعب محدد
  const updatePlayerScore = useCallback((playerId, newScore) => {
    setPlayers(prev =>
      prev.map(player =>
        player.id === playerId ? { ...player, score: newScore } : player
      )
    );
  }, []);

  // تحديث اسم لاعب (اختياري للمرونة)
  const updatePlayerName = useCallback((playerId, newName) => {
    setPlayers(prev =>
      prev.map(player =>
        player.id === playerId ? { ...player, name: newName.trim() } : player
      )
    );
  }, []);

  // إعادة ضبط كل اللاعبين (مسح الأسماء والنقاط)
  const resetPlayers = useCallback(() => {
    setPlayers([]);
    AsyncStorage.removeItem(PLAYERS_KEY);
  }, []);

  // القيمة النهائية للسياق
  const contextValue = useMemo(() => ({
    players,
    addPlayer,
    removePlayer,
    clearPlayers,
    resetPlayerScores,
    updatePlayerScore,
    updatePlayerName,
    resetPlayers,
    loading,
  }), [players, addPlayer, removePlayer, clearPlayers, resetPlayerScores, updatePlayerScore, updatePlayerName, resetPlayers, loading]);

  return (
    <PlayersContext.Provider value={contextValue}>
      {children}
    </PlayersContext.Provider>
  );
};

export const usePlayers = () => useContext(PlayersContext);