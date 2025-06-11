// src/components/Track.js
import React from "react";
import "./Track.css";

const Track = ({ track, onToggleTrack, isInPlaylist }) => {
  return (
    <div className="track">
      <img src={track.albumArt} alt={track.name} className="album-cover" />
      <div className="track-info">
        <span className="track-name">
          <strong>{track.name}</strong>
        </span>
        <span className="track-album">{track.album}</span>
        <span className="track-artist">{track.artist}</span>
      </div>
      <button onClick={() => onToggleTrack(track)}>
        {isInPlaylist ? "Remove" : "Add"}
      </button>
    </div>
  );
};

export default Track;
