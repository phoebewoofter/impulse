import React from 'react';

function SearchBar({ userInput, setUserInput, handleSubmit }) {
  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input 
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Search for a track..."
      />
      <button type="submit">Search</button>
    </form>
  );
}

export default SearchBar;
