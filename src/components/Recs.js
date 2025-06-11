import React, { useState, useEffect } from 'react';

function Recs({ token }) {
  const [recommendedTracks, setRecommendedTracks] = useState([]);

  useEffect(() => {
    // Example: Fetch recommendations based on a seed track.
    const fetchRecommendations = async () => {
      try {
        const seedTracks = '4uLU6hMCjMI75M1A2tKUQC'; // Replace with dynamic seed ids if desired.
        const endpoint = `https://api.spotify.com/v1/recommendations?seed_tracks=${seedTracks}&limit=10`;
        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.tracks) {
          const recs = data.tracks.map(track => ({
            id: track.id,
            name: track.name,
            album: track.album.name,
            artist: track.artists.map(artist => artist.name).join(", "),
            albumArt: track.album.images[0]?.url,
            spotifyLink: track.external_urls.spotify,
          }));
          setRecommendedTracks(recs);
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchRecommendations();
  }, [token]);

  return (
    <div className="accordion recs">
      <h3>Discover new songs and artists</h3>
      <div className="recs-content">
        {recommendedTracks.length > 0 ? (
          recommendedTracks.map(track => (
            <div key={track.id} className="rec-track">
              <img src={track.albumArt} alt={track.album} className="album-art"/>
              <div>
                <strong>{track.name}</strong>
                <p>{track.artist}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No recommendations available</p>
        )}
      </div>
    </div>
  );
}

export default Recs;
