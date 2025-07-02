import React, { useState, useEffect } from 'react';
import './App.css';
import StickyNote from './components/StickyNote';
import AddNoteButton from './components/AddNoteButton';
import SearchBar from './components/SearchBar';

function App() {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('stickyNotes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('stickyNotes', JSON.stringify(notes));
  }, [notes]);

  // Create a new note with better positioning logic
  const addNote = () => {
    const isMobile = window.innerWidth <= 768;
    const noteWidth = isMobile ? 200 : 240;
    const noteHeight = isMobile ? 160 : 200;
    
    // Calculate safe area for note placement
    const safeMargin = 20;
    const buttonArea = isMobile ? 80 : 100; // Space for the add button
    
    const maxX = window.innerWidth - noteWidth - safeMargin;
    const maxY = window.innerHeight - noteHeight - buttonArea;
    
    // Generate random position within safe area
    const x = Math.max(safeMargin, Math.random() * maxX);
    const y = Math.max(120, Math.random() * maxY); // Start below header
    
    const newNote = {
      id: Date.now(),
      text: '',
      x: x,
      y: y,
      color: ['#FFEB3B', '#FF6B6B', '#4ECDC4', '#95E1D3', '#C7CEEA', '#FFB74D', '#81C784', '#F06292'][Math.floor(Math.random() * 8)]
    };
    setNotes([...notes, newNote]);
  };

  // Update note content
  const updateNote = (id, text) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, text } : note
    ));
  };

  // Update note position
  const updatePosition = (id, x, y) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, x, y } : note
    ));
  };

  // Delete a note
  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  // Filter notes based on search term
  const filteredNotes = notes.filter(note =>
    note.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <div className="app-header">
        <h1 className="app-title">Sticky Notes</h1>
        <SearchBar 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm}
          totalNotes={notes.length}
          filteredNotes={filteredNotes.length}
        />
      </div>
      <AddNoteButton onClick={addNote} />
      <div className="notes-container">
        {filteredNotes.map(note => (
          <StickyNote
            key={note.id}
            note={note}
            onUpdate={updateNote}
            onUpdatePosition={updatePosition}
            onDelete={deleteNote}
            searchTerm={searchTerm}
          />
        ))}
      </div>
    </div>
  );
}

export default App;