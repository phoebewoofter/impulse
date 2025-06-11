import React from 'react';
import Tracklist from './Tracklist';

function SearchResults({ results, handleToggleTrackInPlaylist, isTrackInPlaylist }) {
  return (
    <div className="search-results">
      <h2>Results</h2>
      <Tracklist 
        tracks={results}
        handleToggleTrackInPlaylist={handleToggleTrackInPlaylist}
        isTrackInPlaylist={isTrackInPlaylist}
      />
    </div>
  );
}

export default SearchResults;
