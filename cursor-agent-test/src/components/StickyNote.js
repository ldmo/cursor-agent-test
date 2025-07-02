import React, { useState, useRef, useEffect } from 'react';
import './StickyNote.css';

function StickyNote({ note, onUpdate, onUpdatePosition, onDelete }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const noteRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Keep note within viewport
      const maxX = window.innerWidth - 250;
      const maxY = window.innerHeight - 250;
      
      onUpdatePosition(
        note.id,
        Math.max(0, Math.min(newX, maxX)),
        Math.max(0, Math.min(newY, maxY))
      );
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, note.id, onUpdatePosition]);

  const handleMouseDown = (e) => {
    const rect = noteRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  };

  return (
    <div
      ref={noteRef}
      className={`sticky-note ${isDragging ? 'dragging' : ''}`}
      style={{
        backgroundColor: note.color,
        left: `${note.x}px`,
        top: `${note.y}px`,
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="note-header">
        <button className="delete-btn" onClick={() => onDelete(note.id)}>
          ×
        </button>
      </div>
      <textarea
        className="note-content"
        value={note.text}
        onChange={(e) => onUpdate(note.id, e.target.value)}
        placeholder="Write your note here..."
        onMouseDown={(e) => e.stopPropagation()}
      />
      <div className="note-footer"></div>
    </div>
  );
}

export default StickyNote;