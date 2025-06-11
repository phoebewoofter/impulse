import React from 'react';
import Tracklist from './Tracklist';

function Playlist({ playlist, playlistName, handlePlaylistNameChange, handleToggleTrackInPlaylist, handleCreatePlaylist }) {
  return (
    <div className="playlist">
      <h2>Your Playlist</h2>
      <input 
        type="text"
        value={playlistName}
        onChange={handlePlaylistNameChange}
        placeholder="Enter playlist name..."
      />
      <Tracklist 
        tracks={playlist}
        // Since every track in the playlist is already added, we force the button to show "Remove"
        handleToggleTrackInPlaylist={handleToggleTrackInPlaylist}
        isTrackInPlaylist={() => true}
      />
      <button onClick={handleCreatePlaylist} disabled={!playlistName || playlist.length === 0}>
        Upload Playlist to Spotify
      </button>
    </div>
  );
}

export default Playlist;
