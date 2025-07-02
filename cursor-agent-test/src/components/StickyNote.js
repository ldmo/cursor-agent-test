import React, { useState, useRef, useEffect } from 'react';
import './StickyNote.css';

function StickyNote({ note, onUpdate, onUpdatePosition, onDelete, searchTerm }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const noteRef = useRef(null);

  useEffect(() => {
    const handleMove = (e) => {
      if (!isDragging) return;
      
      // Handle both mouse and touch events
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      
      if (!clientX || !clientY) return;
      
      const newX = clientX - dragOffset.x;
      const newY = clientY - dragOffset.y;
      
      // Keep note within viewport with mobile-friendly boundaries
      const noteWidth = noteRef.current ? noteRef.current.offsetWidth : 250;
      const noteHeight = noteRef.current ? noteRef.current.offsetHeight : 250;
      const maxX = window.innerWidth - noteWidth - 10;
      const maxY = window.innerHeight - noteHeight - 10;
      
      onUpdatePosition(
        note.id,
        Math.max(10, Math.min(newX, maxX)),
        Math.max(10, Math.min(newY, maxY))
      );
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      // Add both mouse and touch event listeners
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleMove, { passive: false });
      document.addEventListener('touchend', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, dragOffset, note.id, onUpdatePosition]);

  const handleStart = (e) => {
    // Prevent default to avoid scrolling on mobile
    if (e.type === 'touchstart') {
      e.preventDefault();
    }
    
    const rect = noteRef.current.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    setDragOffset({
      x: clientX - rect.left,
      y: clientY - rect.top
    });
    setIsDragging(true);
  };

  // Highlight search term in the note content
  const getHighlightedText = () => {
    if (!searchTerm || !note.text) return note.text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = note.text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="search-highlight">{part}</mark>
      ) : (
        part
      )
    );
  };

  return (
    <div
      ref={noteRef}
      className={`sticky-note ${isDragging ? 'dragging' : ''} ${searchTerm && note.text.toLowerCase().includes(searchTerm.toLowerCase()) ? 'search-match' : ''}`}
      style={{
        backgroundColor: note.color,
        left: `${note.x}px`,
        top: `${note.y}px`,
      }}
      onMouseDown={handleStart}
      onTouchStart={handleStart}
    >
      <div className="note-header">
        <button 
          className="delete-btn" 
          onClick={() => onDelete(note.id)}
          onTouchStart={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          ×
        </button>
      </div>
      {searchTerm ? (
        <div className="note-content highlighted-content">
          {getHighlightedText()}
        </div>
      ) : (
        <textarea
          className="note-content"
          value={note.text}
          onChange={(e) => onUpdate(note.id, e.target.value)}
          placeholder="Write your note here..."
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        />
      )}
    </div>
  );
}

export default StickyNote;