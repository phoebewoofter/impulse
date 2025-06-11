import React, { useState, useEffect } from 'react';
import './Login.css';

function Login() {
  const CLIENT_ID = "4fa86431d95c4f78b111aacbe5760ea1";
  const REDIRECT_URI = "https://flourishing-halva-064ebe.netlify.app/";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");

  // Capture Spotify token from the URL and store it in sessionStorage
  useEffect(() => {
    const hash = window.location.hash;
    console.log("Hash:", hash); // Debug: see if the hash contains the access_token
    let token = window.sessionStorage.getItem("token");
    if (!token && hash) {
      const params = new URLSearchParams(hash.substring(1));
      token = params.get("access_token");
      console.log("Token found in hash:", token);
      if (token) {
        window.location.hash = "";
        window.sessionStorage.setItem("token", token);
        setToken(token);
        console.log("Token set:", token);
      }
    } else if (token) {
      setToken(token);
    }
  }, []);

  // Once the token is available, fetch and set the user's Spotify ID
  useEffect(() => {
    if (token) {
      getUserId(token);
    }
  }, [token]);

  async function getUserId(token) {
    try {
      console.log('Access Token:', token);
      let userResponse = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!userResponse.ok) {
        throw new Error('Failed to get user ID');
      }
      let userData = await userResponse.json();
      setUserId(userData.id);
      console.log('User ID:', userData.id);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // If not logged in, display the login screen using pure CSS visuals
  if (!token) {
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
            <a
              className="login-button"
              href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
                REDIRECT_URI
              )}&response_type=${RESPONSE_TYPE}&show_dialog=true`}
            >
              Log in
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Once logged in, display a simple success message or redirect to your main app
  return (
    <div className="login-success">
      <h2>Welcome to impulse!</h2>
      <p>Your Spotify user ID: {userId}</p>
      {/* Additional navigation or logout options can be added here */}
    </div>
  );
}

export default Login;
