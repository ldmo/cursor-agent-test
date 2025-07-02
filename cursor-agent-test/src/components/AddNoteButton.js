import React from 'react';
import './AddNoteButton.css';

function AddNoteButton({ onClick }) {
  return (
    <button className="add-note-btn" onClick={onClick}>
      <div className="plus-icon">+</div>
      <span>Add Note</span>
    </button>
  );
}

export default AddNoteButton;