// src/components/Playlist.js
import React from "react";
import Tracklist from "./Tracklist";
import "./Playlist.css";

const Playlist = ({
  playlist,
  playlistName,
  handlePlaylistNameChange,
  handleCreatePlaylist,
  onToggleTrack,
  isTrackInPlaylist,
}) => {
  return (
    <div className="playlist">
      <h2>Your Playlist</h2>
      <input
        type="text"
        placeholder="Playlist Name"
        value={playlistName}
        onChange={handlePlaylistNameChange}
      />
      <Tracklist
        tracks={playlist}
        onToggleTrack={onToggleTrack}
        isTrackInPlaylist={isTrackInPlaylist}
      />
      {playlistName && playlist.length > 0 && (
        <button onClick={handleCreatePlaylist}>
          Upload Playlist to Spotify
        </button>
      )}
    </div>
  );
};

export default Playlist;

