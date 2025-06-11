// src/components/Tracklist.js
import React from "react";
import Track from "./Track";
import "./Tracklist.css";

const Tracklist = ({ tracks, onToggleTrack, isTrackInPlaylist }) => {
  if (!tracks.length) {
    return <p>No tracks found</p>;
  }
  return (
    <div className="tracklist">
      {tracks.map((track) => (
        <Track
          key={track.id}
          track={track}
          onToggleTrack={onToggleTrack}
          isInPlaylist={isTrackInPlaylist(track.id)}
        />
      ))}
    </div>
  );
};

export default Tracklist;
