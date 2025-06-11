import React from 'react';
import Track from './Track';

function Tracklist({ tracks, handleToggleTrackInPlaylist, isTrackInPlaylist }) {
  if (!tracks || tracks.length === 0) {
    return <p>No tracks found</p>;
  }

  return (
    <div className="tracklist">
      {tracks.map(track => (
        <Track 
          key={track.id} 
          track={track}
          handleToggleTrackInPlaylist={handleToggleTrackInPlaylist}
          isInPlaylist={isTrackInPlaylist(track)}
        />
      ))}
    </div>
  );
}

export default Tracklist;
