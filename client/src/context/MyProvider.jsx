import React, { useState, createContext } from 'react';

// Create the context
export const MyContext = createContext();

// Create the provider component
const MyProvider = ({ children }) => {
  const [playerName, setPlayerName] = useState('');

  return (
    <MyContext.Provider value={[playerName, setPlayerName]}>
      {children}
    </MyContext.Provider>
  );
};

export default MyProvider;
