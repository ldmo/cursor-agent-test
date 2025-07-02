import React from 'react';
import './ChessPiece.css';

const ChessPiece = ({ piece }) => {
  const pieceSymbols = {
    white: {
      king: '♔',
      queen: '♕',
      rook: '♖',
      bishop: '♗',
      knight: '♘',
      pawn: '♙'
    },
    black: {
      king: '♚',
      queen: '♛',
      rook: '♜',
      bishop: '♝',
      knight: '♞',
      pawn: '♟'
    }
  };

  if (!piece) return null;
  
  const symbol = pieceSymbols[piece.color][piece.type];
  
  return (
    <div className={`chess-piece ${piece.color}`}>
      {symbol}
    </div>
  );
};

export default ChessPiece;