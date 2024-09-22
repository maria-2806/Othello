import React, { useState } from 'react';
import '../Board.css'; // Assuming you have the styles defined here

const directions = [
  [-1, 0], [1, 0],  
  [0, -1], [0, 1], 
  [-1, -1], [-1, 1], 
  [1, -1], [1, 1]   
];

const Board = () => {
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


  // Function to check if a move is valid
  const isValidMove = (board, row, col, currentPlayer) => {
    if (board[row][col] !== null) {
      return false; 
    }

    const opponent = currentPlayer === 'black' ? 'white' : 'black';

    // Checking  all the 8 directions
    for (let [dx, dy] of directions) {
      let x = row + dx;
      let y = col + dy;
      let hasOpponentDisc = false;

      // Traverse in the directions
      while (x >= 0 && x < 8 && y >= 0 && y < 8 && board[x][y] === opponent) {
        x += dx;
        y += dy;
        hasOpponentDisc = true;
      }
//checking presence of the player's disc at the end of opponents discs
      if (hasOpponentDisc && x >= 0 && x < 8 && y >= 0 && y < 8 && board[x][y] === currentPlayer) {
        return true; // The move is valid
      }
    }

    return false; // No valid direction
  };

  const handleClick = (row, col) => {
    if (isValidMove(board, row, col, currentPlayer)) {
      const updatedBoard = makeMove(board, row, col, currentPlayer);
      setBoard(updatedBoard);
      setCurrentPlayer(currentPlayer === 'black' ? 'white' : 'black'); 
    }
  };

  // moving and fliping the opponent's discs
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
    <div className="compborder flex justify-center">

    <div className="board shadow-2xl">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, colIndex) => {
            const isValid = isValidMove(board, rowIndex, colIndex, currentPlayer);
            return (
              <div
                key={colIndex}
                className={`cell ${isValid ? 'valid-move' : ''}`}
                onClick={() => handleClick(rowIndex, colIndex)}
              >
                {cell === 'black' && <div className="disc black"></div>}
                {cell === 'white' && <div className="disc white"></div>}
              </div>
            );
          })}
        </div>
      ))}
    </div>
    </div>
  );
};

export default Board;
