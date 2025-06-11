import React, { useState, useEffect } from 'react';
import './Login.css';

// Helper: generate a random string for code_verifier
function generateRandomString(length) {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// Helper: generate code challenge from code_verifier using SHA-256 and base64-urlencode it
async function generateCodeChallenge(code_verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(code_verifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  const base64Digest = btoa(String.fromCharCode(...new Uint8Array(digest)));
  // Convert base64 to URL-safe base64
  return base64Digest
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function Login() {
  const CLIENT_ID = "4fa86431d95c4f78b111aacbe5760ea1";
  const REDIRECT_URI = "https://teal-speculoos-73ccce.netlify.app/";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
  // For Authorization Code Flow, use 'code'
  const RESPONSE_TYPE = "code";

  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [codeChallenge, setCodeChallenge] = useState("");

  // On mount, generate (or retrieve) a code verifier and its corresponding challenge
  useEffect(() => {
    let code_verifier = sessionStorage.getItem("code_verifier");
    if (!code_verifier) {
      code_verifier = generateRandomString(128);
      sessionStorage.setItem("code_verifier", code_verifier);
    }
    generateCodeChallenge(code_verifier).then(challenge => {
      setCodeChallenge(challenge);
    });
  }, []);

  // Check for the authorization code in the URL and exchange it for an access token
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authCode = params.get("code");
    if (authCode) {
      exchangeCodeForToken(authCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeChallenge]);

  // Exchange the authorization code for an access token using PKCE parameters
  async function exchangeCodeForToken(authCode) {
    const code_verifier = sessionStorage.getItem("code_verifier");
    const body = new URLSearchParams();
    body.append("grant_type", "authorization_code");
    body.append("code", authCode);
    body.append("redirect_uri", REDIRECT_URI);
    body.append("client_id", CLIENT_ID);
    body.append("code_verifier", code_verifier);

    try {
      const response = await fetch(TOKEN_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });
      const data = await response.json();
      console.log("Token exchange response data:", data);
      if (data.access_token) {
        sessionStorage.setItem("token", data.access_token);
        setToken(data.access_token);
        // Clean up URL (remove ?code= parameter)
        window.history.pushState({}, null, REDIRECT_URI);
      } else {
        console.error("Failed to receive access token:", data);
      }
    } catch (error) {
      console.error("Error exchanging code for token:", error);
    }
  }

  // Once the token is available, fetch and set the user's Spotify ID
  useEffect(() => {
    if (token) {
      getUserId(token);
    }
  }, [token]);

  async function getUserId(token) {
    try {
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
      console.error('Error fetching user data:', error);
    }
  }

  // Until the user is logged in (i.e. token and userId available), show the login screen with our CSS visuals
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
            {codeChallenge ? (
              <a
                className="login-button"
                href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
                  REDIRECT_URI
                )}&response_type=${RESPONSE_TYPE}&code_challenge_method=S256&code_challenge=${codeChallenge}`}
              >
                Log in
              </a>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // If logged in, display a simple welcome screen (or redirect to your main app)
  return (
    <div className="login-success">
      <h2>Welcome to impulse!</h2>
      <p>Your Spotify user ID: {userId}</p>
      {/* Additional navigation or logout options can be added here */}
    </div>
  );
}

export default Login;
