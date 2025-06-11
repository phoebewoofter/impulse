import React, { useState, useEffect } from 'react';
import './Login.css';


function Login() {
  const CLIENT_ID = "4fa86431d95c4f78b111aacbe5760ea1";
  const REDIRECT_URI = "https://teal-speculoos-73ccce.netlify.app/";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";

  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");

  // Capture the Spotify access token from URL hash and store it in sessionStorage
  useEffect(() => {
    const hash = window.location.hash;
    console.log("Hash:", hash);
    let tokenFromStorage = window.sessionStorage.getItem("token");
    if (!tokenFromStorage && hash) {
      const params = new URLSearchParams(hash.substring(1));
      tokenFromStorage = params.get("access_token");
      console.log("Token found in hash:", tokenFromStorage);
      if (tokenFromStorage) {
        window.location.hash = "";
        window.sessionStorage.setItem("token", tokenFromStorage);
        setToken(tokenFromStorage);
      }
    } else if (tokenFromStorage) {
      setToken(tokenFromStorage);
    }
  }, []);

  // Once we have a token, fetch the user's Spotify details (like the user ID)
  useEffect(() => {
    if (token) {
      getUserId(token);
    }
  }, [token]);

  async function getUserId(token) {
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      setUserId(data.id);
      console.log("User ID:", data.id);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  // Redirect to Spotify's authorization endpoint using environment variables
  const handleLogin = () => {
    window.location = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
    )}&response_type=token&show_dialog=true`;
  };

  // If token (or userId) hasn't been set yet, display the login screen with the CSS visuals
  if (!token || !userId) {
    return (
      <div className="login-container">
        <div className="title-animation">
          <h1 className="flicker">impulse</h1>
        </div>
        <div className="cassette-player">
          <div className="headphones">
            <div className="cable"></div>
          </div>
          <div className="cassette">
            <button className="login-button" onClick={handleLogin}>
              Log in
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
