import React, { useState, useEffect } from 'react';
import './App.css';
import ChessBoard from './components/ChessBoard';
import GameControls from './components/GameControls';
import {
  createInitialBoard,
  getValidMoves,
  makeMove,
  isInCheck,
  getGameStatus,
  convertMoveToNotation,
  isCheckmate,
  isStalemate
} from './utils/chessGame';

function App() {
  const [board, setBoard] = useState(createInitialBoard());
  const [currentPlayer, setCurrentPlayer] = useState('white');
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [moveHistory, setMoveHistory] = useState([]);
  const [gameHistory, setGameHistory] = useState([]);
  const [gameStatus, setGameStatus] = useState('White to move');
  const [isGameOver, setIsGameOver] = useState(false);

  // Update game status whenever board or current player changes
  useEffect(() => {
    const status = getGameStatus(board, currentPlayer);
    setGameStatus(status);
    setIsGameOver(isCheckmate(board, currentPlayer) || isStalemate(board, currentPlayer));
  }, [board, currentPlayer]);

  const handleSquareClick = (row, col) => {
    if (isGameOver) return;

    const piece = board[row][col];
    
    // If no square is selected
    if (!selectedSquare) {
      // Only select if there's a piece and it's the current player's piece
      if (piece && piece.color === currentPlayer) {
        setSelectedSquare({ row, col });
        const moves = getValidMoves(board, row, col);
        setValidMoves(moves);
      }
      return;
    }

    // If clicking on the same square, deselect
    if (selectedSquare.row === row && selectedSquare.col === col) {
      setSelectedSquare(null);
      setValidMoves([]);
      return;
    }

    // If selecting a different piece of the same color
    if (piece && piece.color === currentPlayer) {
      setSelectedSquare({ row, col });
      const moves = getValidMoves(board, row, col);
      setValidMoves(moves);
      return;
    }

    // Check if the move is valid
    const isValidMove = validMoves.some(([moveRow, moveCol]) => moveRow === row && moveCol === col);
    
    if (isValidMove) {
      // Make the move
      const moveNotation = convertMoveToNotation(board, selectedSquare.row, selectedSquare.col, row, col);
      const newBoard = makeMove(board, selectedSquare.row, selectedSquare.col, row, col);
      
      // Save game state for undo functionality
      setGameHistory([...gameHistory, { board: [...board.map(row => [...row])], currentPlayer, moveHistory: [...moveHistory] }]);
      
      setBoard(newBoard);
      setMoveHistory([...moveHistory, moveNotation]);
      setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
      setSelectedSquare(null);
      setValidMoves([]);
    } else {
      // Invalid move, just deselect
      setSelectedSquare(null);
      setValidMoves([]);
    }
  };

  const resetGame = () => {
    setBoard(createInitialBoard());
    setCurrentPlayer('white');
    setSelectedSquare(null);
    setValidMoves([]);
    setMoveHistory([]);
    setGameHistory([]);
    setGameStatus('White to move');
    setIsGameOver(false);
  };

  const undoMove = () => {
    if (gameHistory.length === 0) return;
    
    const lastState = gameHistory[gameHistory.length - 1];
    setBoard(lastState.board);
    setCurrentPlayer(lastState.currentPlayer);
    setMoveHistory(lastState.moveHistory);
    setGameHistory(gameHistory.slice(0, -1));
    setSelectedSquare(null);
    setValidMoves([]);
  };

  const isCheck = isInCheck(board, currentPlayer);

  return (
    <div className="App">
      <div className="app-header">
        <h1 className="app-title">Chess Game</h1>
        <p className="app-subtitle">Classic Chess with Modern Interface</p>
      </div>
      
      <div className="game-container">
        <ChessBoard
          board={board}
          selectedSquare={selectedSquare}
          onSquareClick={handleSquareClick}
          currentPlayer={currentPlayer}
          isCheck={isCheck}
        />
        
        <GameControls
          onReset={resetGame}
          onUndo={undoMove}
          canUndo={gameHistory.length > 0}
          gameStatus={gameStatus}
          moveHistory={moveHistory}
        />
      </div>
      
      {isGameOver && (
        <div className="game-over-overlay">
          <div className="game-over-modal">
            <h2>Game Over!</h2>
            <p>{gameStatus}</p>
            <button onClick={resetGame} className="play-again-btn">
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;