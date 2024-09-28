import React, { useContext, useState } from 'react';
import { MyContext } from '../context/MyProvider';

const directions = [
  [-1, 0], [1, 0], [0, -1], [0, 1], 
  [-1, -1], [-1, 1], [1, -1], [1, 1]
];

const Board = () => {
  const [playerName] = useContext(MyContext);
  const emptyBoard = Array(8).fill(null).map(() => Array(8).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('black');

  const [board, setBoard] = useState(() => {
    const initialBoard = [...emptyBoard];
    initialBoard[3][3] = 'white';
    initialBoard[3][4] = 'black';
    initialBoard[4][3] = 'black';
    initialBoard[4][4] = 'white';
    return initialBoard;
  });

  const isValidMove = (board, row, col, currentPlayer) => {
    if (board[row][col] !== null) {
      return false;
    }

    const opponent = currentPlayer === 'black' ? 'white' : 'black';

    for (let [dx, dy] of directions) {
      let x = row + dx;
      let y = col + dy;
      let hasOpponentDisc = false;

      while (x >= 0 && x < 8 && y >= 0 && y < 8 && board[x][y] === opponent) {
        x += dx;
        y += dy;
        hasOpponentDisc = true;
      }

      if (hasOpponentDisc && x >= 0 && x < 8 && y >= 0 && y < 8 && board[x][y] === currentPlayer) {
        return true;
      }
    }

    return false;
  };


  const hasValidMoves = (board, currentPlayer) => {
    return getValidMoves(board, currentPlayer).length > 0;
  };


  const checkGameEnd = (board) => {
    const blackMoves = hasValidMoves(board, 'black');
    const whiteMoves = hasValidMoves(board, 'white');
  
    if (!blackMoves && !whiteMoves) {
      const blackCount = board.flat().filter(cell => cell === 'black').length;
      const whiteCount = board.flat().filter(cell => cell === 'white').length;
  
      if (blackCount > whiteCount) {
        alert('Black wins!');
      } else if (whiteCount > blackCount) {
        alert('White wins!');
      } else {
        alert('It\'s a tie!');
      }
  
      return true;  
    }
  
    return false; 
  };
  

  const handleClick = (row, col) => {
    if (currentPlayer !== 'black') return; 
  
    if (isValidMove(board, row, col, currentPlayer)) {
      const updatedBoard = makeMove(board, row, col, currentPlayer);
      setBoard(updatedBoard);
      setCurrentPlayer(currentPlayer === 'black' ? 'white' : 'black');
    
      if (checkGameEnd(updatedBoard)) {
        return;  
      }
  
      setTimeout(() => {
        if (hasValidMoves(updatedBoard, 'white')) {
          aiMove('white', updatedBoard);  
        } else {
          alert('White has no valid moves. Skipping turn.');
          setCurrentPlayer('black'); 
        }
      }, 1000);  
    }
  };
  
  
  

  const makeMove = (board, row, col, currentPlayer) => {
    const newBoard = board.map(row => row.slice());
    const opponent = currentPlayer === 'black' ? 'white' : 'black';

    newBoard[row][col] = currentPlayer;

    for (let [dx, dy] of directions) {
      let x = row + dx;
      let y = col + dy;
      const discsToFlip = [];

      while (x >= 0 && x < 8 && y >= 0 && y < 8 && newBoard[x][y] === opponent) {
        discsToFlip.push([x, y]);
        x += dx;
        y += dy;
      }

      if (x >= 0 && x < 8 && y >= 0 && y < 8 && newBoard[x][y] === currentPlayer) {
        for (let [flipX, flipY] of discsToFlip) {
          newBoard[flipX][flipY] = currentPlayer;
        }
      }
    }

    return newBoard;
  };

  

  const evaluateBoard = (board, aiPlayer) => {
    let score = 0;
    const opponent = aiPlayer === 'black' ? 'white' : 'black';
  
    for (let row of board) {
      for (let cell of row) {
        if (cell === aiPlayer) {
          score += 1;  
        } else if (cell === opponent) {
          score -= 1;  
        }
      }
    }
  
    return score;
  };
  
  const maximax = (board, depth, maximizingPlayer, currentPlayer, aiPlayer) => {
    if (depth === 0) {
      return evaluateBoard(board, aiPlayer);  
    }
  
    const opponent = aiPlayer === 'black' ? 'white' : 'black';
    const validMoves = getValidMoves(board, currentPlayer);
  
    if (validMoves.length === 0) {
      return evaluateBoard(board, aiPlayer);  
    }
  
    if (maximizingPlayer) {
      let maxEval = -Infinity;
      for (let [row, col] of validMoves) {
        const newBoard = makeMove(board, row, col, currentPlayer);
        const evaluation = maximax(newBoard, depth - 1, false, opponent, aiPlayer);  
        maxEval = Math.max(maxEval, evaluation);
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let [row, col] of validMoves) {
        const newBoard = makeMove(board, row, col, currentPlayer);
        const evaluation = maximax(newBoard, depth - 1, true, opponent, aiPlayer);
        minEval = Math.min(minEval, evaluation);
      }
      return minEval;
    }
  };
  const aiMove = (aiPlayer, currentBoard) => {
    const depth = 3;  
    let bestMove = null;
    let bestScore = -Infinity;
  
    const validMoves = getValidMoves(currentBoard, aiPlayer);
  
    if (validMoves.length === 0) {
      alert(`${aiPlayer} has no valid moves. Skipping turn.`);
      setCurrentPlayer(aiPlayer === 'black' ? 'white' : 'black');  
      return;
    }
  
    for (let [row, col] of validMoves) {
      const newBoard = makeMove(currentBoard, row, col, aiPlayer);
      const score = maximax(newBoard, depth - 1, false, aiPlayer === 'black' ? 'white' : 'black', aiPlayer);
  
      if (score > bestScore) {
        bestScore = score;
        bestMove = [row, col];
      }
    }
  
    if (bestMove) {
      const updatedBoard = makeMove(currentBoard, bestMove[0], bestMove[1], aiPlayer);
      setBoard(updatedBoard);
      setCurrentPlayer(aiPlayer === 'black' ? 'white' : 'black');  
  
      if (checkGameEnd(updatedBoard)) {
        return;  
      }
    }
  };
  
  

  const getValidMoves = (board, player) => {
    const moves = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (isValidMove(board, row, col, player)) {
          moves.push([row, col]);
        }
      }
    }
    return moves;
  };
  
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="mb-5 text-4xl font-bold text-gray-800">Othello</div>
      <div className="bg-[#000000] p-4 rounded-lg shadow-2xl">
        <div className="grid grid-cols-8 gap-1">
          {board.map((row, rowIndex) => (
            row.map((cell, colIndex) => {
              const isValid = isValidMove(board, rowIndex, colIndex, currentPlayer);
              return (
                <div style={{boxShadow: 'boxShadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.001)'}}
                  className={`w-12 h-12 bg-[#0b5a0b] shadow-inner flex items-center justify-center cursor-pointer
                    ${isValid ? 'hover:bg-[#107e0f]' : ''}`}
                  onClick={() => handleClick(rowIndex, colIndex)}
                >
                  {cell && (
  <div
    className={`w-10 h-10 ${
      cell === 'black' ? 'bg-black' : 'bg-gray-100'
    } rounded-full shadow-lg shadow-black/50 flex items-center justify-center`}
  >
    <div
      className={`w-8 h-8 rounded-full ${
        cell === 'black'
          ? 'bg-gradient-to-br from-gray-800 to-black'
          : 'bg-gradient-to-br from-gray-300 to-gray-100'
      }`}
    ></div>
  </div>
)}

                  {isValid && !cell && (
                    <div className={`w-4 h-4 rounded-full drop-shadow-xl ${
                      currentPlayer === 'black' ? 'bg-gray-900' : 'bg-gray-100'
                    } opacity-50`}></div>
                  )}
                </div>
              );
            })
          ))}
        </div>
      </div>
      <div className="mt-4 text-2xl font-semibold text-gray-700">
        Player: <span className="text-blue-600">{playerName}</span>
      </div>
      <div className="mt-2 text-xl font-medium text-gray-600">
        Current Turn: <span className='font-bold text-black'>
          {currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}
        </span>
      </div>
    </div>
  );
};

export default Board;