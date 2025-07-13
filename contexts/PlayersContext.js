// contexts/PlayersContext.js

import React, { createContext, useState, useContext } from 'react';

const PlayersContext = createContext();

export const PlayersProvider = ({ children }) => {
  const [players, setPlayers] = useState([]); // قائمة اللاعبين، يتم مسحها عند إعادة تشغيل التطبيق

  // دوال لتعديل قائمة اللاعبين
  const addPlayer = (name) => {
    if (name.trim().length === 0) {
      return { success: false, message: 'الرجاء إدخال اسم اللاعب.' };
    }
    if (players.length >= 8) { // يمكنك تحديد عدد أقصى للاعبين
      return { success: false, message: 'لا يمكن إضافة أكثر من 8 لاعبين.' };
    }
    setPlayers(prevPlayers => [
      ...prevPlayers,
      { id: Math.random().toString(), name: name.trim(), score: 0 }
    ]);
    return { success: true };
  };

  const removePlayer = (id) => {
    setPlayers(prevPlayers => prevPlayers.filter(player => player.id !== id));
  };

  const clearPlayers = () => {
    setPlayers([]); // مسح قائمة اللاعبين بالكامل (بما في ذلك الأسماء)
  };

  // الدالة الجديدة لتصفير نقاط اللاعبين فقط
  const resetPlayerScores = () => {
    setPlayers(prevPlayers =>
      prevPlayers.map(player => ({ ...player, score: 0 }))
    );
  };

  // --- الدالة التي كانت ناقصة ---
  const updatePlayerScore = (playerId, newScore) => {
    setPlayers(prevPlayers =>
      prevPlayers.map(player =>
        player.id === playerId ? { ...player, score: newScore } : player
      )
    );
  };

  // قيمة الـ Context التي سيتم توفيرها للمكونات
  const contextValue = {
    players,
    addPlayer,
    removePlayer,
    clearPlayers,
    resetPlayerScores,
    updatePlayerScore, // <-- إضافة الدالة الجديدة هنا لتكون متاحة
  };

  return (
    <PlayersContext.Provider value={contextValue}>
      {children}
    </PlayersContext.Provider>
  );
};

export const usePlayers = () => {
  return useContext(PlayersContext);
};