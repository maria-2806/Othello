import React, { useState, createContext } from 'react';

export const MyContext = createContext();

const MyProvider = ({ children }) => {
  const [playerName, setPlayerName] = useState('');

  return (
    <MyContext.Provider value={[playerName, setPlayerName]}>
      {children}
    </MyContext.Provider>
  );
};

export default MyProvider;
