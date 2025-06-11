import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import Playlist from './components/Playlist';
import Recs from './components/Recs';
import './App.css';

function App() {
  // State variables
  const [results, setResults] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [playlistName, setPlaylistName] = useState("");
  const [playlist, setPlaylist] = useState([]);
  const [token, setToken] = useState("");
  const [userData, setUserData] = useState(null);

  // On mount, load the token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // When a token is set, fetch the user's Spotify profile data.
  useEffect(() => {
    if (token) {
      fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUserData(data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [token]);

  // Search Spotify for tracks based on user input
  const handleSearch = async () => {
    if (!userInput) return;

    const endpoint = `https://api.spotify.com/v1/search?q=${encodeURIComponent(userInput)}&type=track`;
    try {
      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.tracks) {
        // Map through the tracks and extract the needed fields
        const tracks = data.tracks.items.map((track) => ({
          id: track.id,
          name: track.name,
          album: track.album.name,
          artist: track.artists.map((artist) => artist.name).join(", "),
          albumArt: track.album.images[0]?.url,
          spotifyLink: track.external_urls.spotify,
        }));
        setResults(tracks);
      }
    } catch (error) {
      console.error("Error fetching data from Spotify:", error);
    }
  };

  // Submit search (prevents default form submission)
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  // Updates the playlist name state
  const handlePlaylistNameChange = (e) => {
    setPlaylistName(e.target.value);
  };

  // Checks if the track is already in the playlist
  const isTrackInPlaylist = (track) => {
    return playlist.some((t) => t.id === track.id);
  };

  // Adds a track to the playlist if it isn’t already there
  const handleAddToPlaylist = (track) => {
    if (!isTrackInPlaylist(track)) {
      setPlaylist([...playlist, track]);
    }
  };

  // Removes a track from the playlist
  const handleRemoveFromPlaylist = (track) => {
    setPlaylist(playlist.filter((t) => t.id !== track.id));
  };

  // Toggles the track in the playlist
  const handleToggleTrackInPlaylist = (track) => {
    if (isTrackInPlaylist(track)) {
      handleRemoveFromPlaylist(track);
    } else {
      handleAddToPlaylist(track);
    }
  };

  // Creates a new playlist on Spotify and adds tracks to it.
  const handleCreatePlaylist = async () => {
    if (!playlistName || playlist.length === 0) {
      alert("Please provide a playlist name and add at least one track");
      return;
    }

    try {
      // Get user's Spotify ID
      const userResponse = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await userResponse.json();
      const userId = userData.id;

      // Create a new playlist
      const createResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: playlistName,
          public: false,
        }),
      });
      const playlistData = await createResponse.json();

      // Prepare track URIs for adding to the playlist
      const trackUris = playlist.map((track) => `spotify:track:${track.id}`);
      await fetch(`https://api.spotify.com/v1/playlists/${playlistData.id}/tracks`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uris: trackUris }),
      });
      alert("Playlist created successfully on Spotify!");

      // Clear name and playlist states after creating the playlist
      setPlaylist([]);
      setPlaylistName("");
    } catch (error) {
      console.error("Error creating playlist:", error);
    }
  };

  // Logout function clears localStorage and resets state
  const logoutClick = () => {
    localStorage.clear();
    setToken("");
    setUserData(null);
    window.location.reload();
  };

  // If no access token is available, render the Login component.
  if (!token) {
    return <Login />;
  }

  return (
    <div className="App">
      <header>
        <h1>impulse</h1>
      </header>
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        {userData ? (
          <>
            <h2>Welcome, {userData.display_name}!</h2>
            <p>User ID: {userData.id}</p>
            <button onClick={logoutClick}>Logout</button>
          </>
        ) : (
          <p>Loading your Spotify profile...</p>
        )}
      </div>
      <SearchBar 
        userInput={userInput}
        setUserInput={setUserInput}
        handleSubmit={handleSubmit}
      />
      <SearchResults 
        results={results}
        handleToggleTrackInPlaylist={handleToggleTrackInPlaylist}
        isTrackInPlaylist={isTrackInPlaylist}
      />
      <Playlist 
        playlist={playlist}
        playlistName={playlistName}
        handlePlaylistNameChange={handlePlaylistNameChange}
        handleToggleTrackInPlaylist={handleToggleTrackInPlaylist}
        handleCreatePlaylist={handleCreatePlaylist}
      />
      <Recs token={token} />
    </div>
  );
}

export default App;
