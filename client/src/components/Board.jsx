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

  const handleClick = (row, col) => {
    if (isValidMove(board, row, col, currentPlayer)) {
      const updatedBoard = makeMove(board, row, col, currentPlayer);
      setBoard(updatedBoard);
      setCurrentPlayer(currentPlayer === 'black' ? 'white' : 'black');
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