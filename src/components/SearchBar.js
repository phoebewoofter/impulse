// src/components/SearchBar.js
import React from "react";
import "./SearchBar.css";

const SearchBar = ({ userInput, setUserInput, handleSubmit }) => {
  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search for tracks"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;
