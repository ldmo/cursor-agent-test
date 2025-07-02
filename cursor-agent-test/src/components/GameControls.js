import React from 'react';
import './GameControls.css';

const GameControls = ({ onReset, onUndo, canUndo, gameStatus, moveHistory }) => {
  return (
    <div className="game-controls">
      <div className="control-buttons">
        <button onClick={onReset} className="reset-btn">
          New Game
        </button>
        <button 
          onClick={onUndo} 
          disabled={!canUndo}
          className="undo-btn"
        >
          Undo Move
        </button>
      </div>
      
      <div className="game-info">
        <div className="game-status">
          <h3>Game Status</h3>
          <p>{gameStatus}</p>
        </div>
        
        <div className="move-history">
          <h3>Move History</h3>
          <div className="moves-list">
            {moveHistory.length === 0 ? (
              <p>No moves yet</p>
            ) : (
              moveHistory.map((move, index) => (
                <div key={index} className="move-item">
                  <span className="move-number">{Math.floor(index / 2) + 1}.</span>
                  <span className="move-notation">{move}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameControls;