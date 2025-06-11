// src/components/SearchResults.js
import React from "react";
import Tracklist from "./Tracklist";
import "./SearchResults.css";

const SearchResults = ({ results, onToggleTrack, isTrackInPlaylist }) => {
  return (
    <div className="search-results">
      <h2>Results</h2>
      <Tracklist
        tracks={results}
        onToggleTrack={onToggleTrack}
        isTrackInPlaylist={isTrackInPlaylist}
      />
    </div>
  );
};

export default SearchResults;

