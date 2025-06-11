import React from 'react';

function Track({ track, handleToggleTrackInPlaylist, isInPlaylist }) {
  return (
    <div className="track">
      <img src={track.albumArt} alt={`Album cover for ${track.album}`} className="album-art"/>
      <div className="track-details">
        <strong>{track.name}</strong>
        <p>{track.album}</p>
        <p>{track.artist}</p>
      </div>
      <button onClick={() => handleToggleTrackInPlaylist(track)}>
        {isInPlaylist ? 'Remove' : 'Add'}
      </button>
    </div>
  );
}

export default Track;
