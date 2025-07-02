import React from 'react';
import ChessSquare from './ChessSquare';
import './ChessBoard.css';

const ChessBoard = ({ board, selectedSquare, onSquareClick, currentPlayer, isCheck }) => {
  const renderSquare = (row, col) => {
    const piece = board[row][col];
    const isSelected = selectedSquare && selectedSquare.row === row && selectedSquare.col === col;
    const isLight = (row + col) % 2 === 0;
    
    return (
      <ChessSquare
        key={`${row}-${col}`}
        piece={piece}
        isLight={isLight}
        isSelected={isSelected}
        onClick={() => onSquareClick(row, col)}
        position={{ row, col }}
      />
    );
  };

  return (
    <div className="chess-board">
      <div className="game-status">
        <h2>Current Player: {currentPlayer === 'white' ? 'White' : 'Black'}</h2>
        {isCheck && <div className="check-warning">Check!</div>}
      </div>
      <div className="board-grid">
        {Array.from({ length: 8 }, (_, row) => (
          <div key={row} className="board-row">
            {Array.from({ length: 8 }, (_, col) => renderSquare(row, col))}
          </div>
        ))}
      </div>
      <div className="board-coordinates">
        <div className="files">
          {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(file => (
            <span key={file} className="file">{file}</span>
          ))}
        </div>
        <div className="ranks">
          {[8, 7, 6, 5, 4, 3, 2, 1].map(rank => (
            <span key={rank} className="rank">{rank}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChessBoard;