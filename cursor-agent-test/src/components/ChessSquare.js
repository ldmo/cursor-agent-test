import React from 'react';
import ChessPiece from './ChessPiece';
import './ChessSquare.css';

const ChessSquare = ({ piece, isLight, isSelected, onClick, position }) => {
  const squareClass = `chess-square ${isLight ? 'light' : 'dark'} ${isSelected ? 'selected' : ''}`;
  
  return (
    <div className={squareClass} onClick={onClick}>
      {piece && <ChessPiece piece={piece} />}
    </div>
  );
};

export default ChessSquare;