import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Board from './components/Board';
import PlayerName from './components/PlayerName';
import MyProvider from './context/MyProvider';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <MyProvider>

    <Router>
      <Routes>
        <Route path="/" element={<PlayerName />} />  
        <Route path="/board" element={<Board />} />
      </Routes>
    </Router>
    </MyProvider>
  );
}

export default App;
