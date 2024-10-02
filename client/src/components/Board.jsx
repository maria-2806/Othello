import React, { useContext, useState } from 'react';
import { MyContext } from '../context/MyProvider';
// import "../assets/Group 1.svg"
// import { ReactComponent as MyIcon } from '../assets/';
import heroimg from '../assets/Group1.svg'
import Button from 'react-bootstrap/Button';



import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
const directions = [
  [-1, 0], [1, 0], [0, -1], [0, 1],
  [-1, -1], [-1, 1], [1, -1], [1, 1]
];

const Board = () => {
  const [playerName] = useContext(MyContext);
  const emptyBoard = Array(8).fill(null).map(() => Array(8).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('black');
  const [gameResult, setGameResult] = useState(null);

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
        setGameResult('Black wins!');
      } else if (whiteCount > blackCount) {
        setGameResult('White wins!');
      } else {
        setGameResult("It's a tie!");
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
      setCurrentPlayer('white');

      if (checkGameEnd(updatedBoard)) {
        return;
      }

      setTimeout(() => {
        if (hasValidMoves(updatedBoard, 'white')) {
          aiMove('white', updatedBoard);
        } else {
          alert('White has no valid moves. Skipping turn.');
          setCurrentPlayer('black');
          if (!hasValidMoves(updatedBoard, 'black')) {
            checkGameEnd(updatedBoard);
          }
        }
      }, 1000);
    } else {
      if (!hasValidMoves(board, 'black')) {
        alert('Black has no valid moves. Skipping turn.');
        setCurrentPlayer('white');
      }
    }
  };


  const calculateScore = (board) => {
    let blackScore = 0;
    let whiteScore = 0;
    for (let row of board) {
      for (let cell of row) {
        if (cell === 'black') {
          blackScore += 1;
        } else if (cell === 'white') {
          whiteScore += 1;
        }
      }
    }
    return { blackScore, whiteScore };
  };

  const { blackScore, whiteScore } = calculateScore(board); 




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
    const depth = 6;
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

      if (!hasValidMoves(updatedBoard, 'black')) {
        alert('Black has no valid moves. Skipping turn.');
        setTimeout(() => aiMove('white', updatedBoard), 1000);
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
  <div className='bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.8),_rgba(0,0,0,2))] p-0 m-0  min-w-screen min-h-screen'>

      <div className="top">
        <div className='flex justify-center'> <img className='lg:w-[20vw] lg:pt-3 pb-3 lg:pb-5 pt-3 xl:h-24 shadow-xl xl:pt-5 ' src={heroimg}></img> </div>

      </div>
    <div className="lg:flex justify-evenly items-center">
      
      <div className="lg:left pb-9 lg:w-1/4">
        <div className='flex flex-col justify-center border'>

        <div className="info text-white mt-4 px-4 text-center">
          Simple to learn, impossible to master! Flip your way to victory in this timeless strategy game where every move counts. With each turn, the board shifts, and fortunes can change in an instant.
          New to the game?? 
        </div>
        {/* {<div className="mb-5 text-4xl font-bold text-white">Othello</div>} */}
        

          <Dialog>
            <DialogTrigger className='text-white px-4 hover:underline font-bold pb-3'>   Check out the instructions to playℹ️



            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className=" text-xl">Instructions</DialogTitle>
                <DialogDescription>
                  <p className='text-lg font-bold'>Objective:</p>
                  The goal is to have more of your color discs on the board than your opponent when the game ends. You play as black and the computer plays as white.
                  <div className='w-full h-[0.8px] mt-2 mb-1 bg-gray-400 rounded-full'></div>

                  <div>

                    <p className='text-lg font-bold my-2'>How to Play:</p>
                    <div>

                      <p className='font-bold mb-2'>1. Your Turn (Black):</p>

                      Place your black disc on the board to trap one or more white discs between two of your black discs.
                      The trapped white discs will flip to black.
                      If you don't have a valid move, your turn is skipped.
                    </div>
                    <div>

                      <p className=' font-bold mt-3 mb-2'>2. Automated Turn (White):</p>

                      After you make your move, the computer (white) will automatically place a disc following the same rules.
                      The computer will flip black discs to white when possible.

                    </div>
                    <div>

                      <p className=' font-bold mt-3 mb-2'>Winning the Game:</p>
                      The game ends when the board is full. The player with the most discs of their color on the board wins.

                    </div>
                    <div className='mt-2 font-bold'>Enjoy playing Othello!</div>
                  </div>


                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        
        <div className='flex justify-center'>

          {gameResult && (
            <span className="mt-4 text-3xl font-bold text-green-600 px-4 text-center">
              {gameResult}
            </span>
          )}
          </div>
        </div>
      </div>

      <div className="middle pb-9  flex justify-center items-center">

        <div className="bg-[#000000] p-4 rounded-lg shadow-2xl md:max-w-[465px] md:max-h-[465px]">
          <div className="grid grid-cols-8 gap-x-1 gap-y-1">
            {board.map((row, rowIndex) => (
              row.map((cell, colIndex) => {
                const isValid = isValidMove(board, rowIndex, colIndex, currentPlayer);
                return (
                  <div style={{ boxShadow: 'boxShadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.001)' }}
                  className={`lg:w-12 lg:h-12 w-10 h-10 bg-[#0b5a0b] shadow-inner flex items-center justify-center cursor-pointer
                    ${isValid ? 'hover:bg-[#107e0f]' : ''}`}
                    onClick={() => handleClick(rowIndex, colIndex)}
                    >
                    {cell && (
                      <div
                      className={`lg:w-10 w-8 h-8 lg:h-10 ${cell === 'black' ? 'bg-black' : 'bg-gray-100'
                      } rounded-full shadow-lg shadow-black/50 flex items-center justify-center`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full ${cell === 'black'
                            ? 'bg-gradient-to-br from-gray-800 to-black'
                            : 'bg-gradient-to-br from-gray-300 to-gray-100'
                            }`}
                            ></div>
                      </div>
                    )}

                    {isValid && !cell && (
                      <div className={`w-4 h-4 rounded-full drop-shadow-xl ${currentPlayer === 'black' ? 'bg-gray-900' : 'bg-gray-100'
                      } opacity-50`}></div>
                    )}
                  </div>
                );
              })
            ))}
          </div>
        </div>
      </div>
      <div className="right md:pb-9 lg:w-1/4 xl:w-1/4 text-white flex justify-center ">
        <div className='bg-[#969696] lg:w-[20vw] max-h-56 px-5 lg:mb-4 md:mb-0 md:pb-2 rounded-lg'>

        <div className="mt-4 text-2xl font-semibold text-center">Player: {playerName}</div>
        <div className="mt-2 text-xl font-medium text-center">Current Turn:
          <span className="ml-2 text-center">
            <div className={`inline-block w-6 h-6 rounded-full ${currentPlayer === 'black' ? 'bg-black' : 'bg-gray-100'}`}></div>
          </span>
        </div>
        <div className="mt-6 text-xl font-medium text-center">Score</div>
        <div className="text-lg font-medium text-center">
          <div>Black: {blackScore}</div>
          <div>White: {whiteScore}</div>
        </div>
        </ div>
      </div>
    </div>
            </div>
  );
};

export default Board;