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

  // Create a new note
  const addNote = () => {
    const newNote = {
      id: Date.now(),
      text: '',
      x: Math.random() * (window.innerWidth - 250),
      y: Math.random() * (window.innerHeight - 250),
      color: ['#FFEB3B', '#FF6B6B', '#4ECDC4', '#95E1D3', '#C7CEEA'][Math.floor(Math.random() * 5)]
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
        <h1 className="app-title">My Sticky Notes</h1>
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