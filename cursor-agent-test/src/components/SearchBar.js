import React from 'react';
import './SearchBar.css';

function SearchBar({ searchTerm, onSearchChange, totalNotes, filteredNotes }) {
  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchTerm && (
          <button 
            className="clear-search"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
      <div className="search-results-count">
        {searchTerm && (
          <span>
            {filteredNotes} of {totalNotes} notes
          </span>
        )}
      </div>
    </div>
  );
}

export default SearchBar;