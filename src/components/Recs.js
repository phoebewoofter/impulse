// src/components/Recs.js
import React, { useState, useEffect } from "react";
import "./Recs.css";

const Recs = ({ token }) => {
  const [recommendedTracks, setRecommendedTracks] = useState([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchRecs = async () => {
      // Fetch recommendations. Here we use a fixed seed track for demonstration.
      const response = await fetch(
        `https://api.spotify.com/v1/recommendations?seed_tracks=4fa86431d95c4f78b111aacbe5760ea1&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.tracks) {
        const recs = data.tracks.map((track) => ({
          id: track.id,
          name: track.name,
          album: track.album.name,
          artist: track.artists.map((a) => a.name).join(", "),
          albumArt: track.album.images[0] ? track.album.images[0].url : "",
          spotifyLink: track.external_urls.spotify,
        }));
        setRecommendedTracks(recs);
      }
    };
    fetchRecs();
  }, [token]);

  return (
    <div className={`recs-accordion ${expanded ? "expanded" : "collapsed"}`}>
      <div className="accordion-header" onClick={() => setExpanded(!expanded)}>
        <h3>Discover new songs and artists</h3>
      </div>
      {expanded && (
        <div className="accordion-content">
          {recommendedTracks.map((track) => (
            <div key={track.id} className="rec-track">
              <img src={track.albumArt} alt={track.name} className="album-cover" />
              <div>
                <p>
                  <strong>{track.name}</strong>
                </p>
                <p>{track.artist}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recs;
