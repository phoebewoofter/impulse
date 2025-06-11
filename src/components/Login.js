  import React, { useState, useEffect } from 'react';
  import './Login.css';
  
  // --- Spotify API Constants ---
  const clientId = '4fa86431d95c4f78b111aacbe5760ea1';         // Your Spotify Client ID
  const redirectUrl = 'https://teal-speculoos-77ccce.netlify.app/';       // Your redirect URL (must match what’s registered)
  const authorizationEndpoint = "https://accounts.spotify.com/authorize";
  const tokenEndpoint = "https://accounts.spotify.com/api/token";
  const scope = 'user-read-private user-read-email';
  
  // --- Token Manager --- 
  const currentToken = {
    get access_token() {
      return localStorage.getItem('access_token') || null;
    },
    get refresh_token() {
      return localStorage.getItem('refresh_token') || null;
    },
    get expires_in() {
      return localStorage.getItem('expires_in') || null;
    },
    get expires() {
      return localStorage.getItem('expires') || null;
    },
    save: function(response) {
      const { access_token, refresh_token, expires_in } = response;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('expires_in', expires_in);
  
      const now = new Date();
      const expiry = new Date(now.getTime() + (expires_in * 1000));
      localStorage.setItem('expires', expiry);
    }
  };
  
  function Login() {
    const [accessToken, setAccessToken] = useState(currentToken.access_token);
    const [userData, setUserData] = useState(null);
  
    // --- On Mount: Process URL parameters for "code" ---
    useEffect(() => {
      async function processAuthCode() {
        const args = new URLSearchParams(window.location.search);
        const code = args.get('code');
        if (code && !accessToken) {
          const tokenResponse = await getToken(code);
          currentToken.save(tokenResponse);
          setAccessToken(tokenResponse.access_token);
  
          // Remove the "code" parameter from the URL for clean refreshes.
          const url = new URL(window.location.href);
          url.searchParams.delete("code");
          window.history.replaceState({}, document.title, url.href);
        }
      }
      processAuthCode();
    }, [accessToken]);
  
    // --- When Access Token is set: Fetch and set user data ---
    useEffect(() => {
      async function fetchUserData() {
        if (accessToken) {
          const data = await getUserData();
          setUserData(data);
        }
      }
      fetchUserData();
    }, [accessToken]);
  
    // --- Function: Redirect the user to Spotify for Authorization using PKCE ---
    async function redirectToSpotifyAuthorize() {
      // Generate a random code_verifier:
      const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const randomValues = crypto.getRandomValues(new Uint8Array(64));
      const randomString = Array.from(randomValues).reduce((acc, x) => acc + possible[x % possible.length], "");
      const code_verifier = randomString;
      localStorage.setItem('code_verifier', code_verifier);
      
      // Generate code_challenge from the code_verifier using SHA-256:
      const data = new TextEncoder().encode(code_verifier);
      const hashedBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashedBuffer));
      const hashString = hashArray.map(b => String.fromCharCode(b)).join('');
      const base64String = btoa(hashString);
      const code_challenge = base64String
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
      
      // Build the Spotify authorization URL with PKCE parameters:
      const authUrl = new URL(authorizationEndpoint);
      const params = {
        response_type: 'code',
        client_id: clientId,
        scope: scope,
        code_challenge_method: 'S256',
        code_challenge: code_challenge,
        redirect_uri: redirectUrl,
      };
      authUrl.search = new URLSearchParams(params).toString();
      window.location.href = authUrl.toString(); // Redirect to Spotify for login
    }
  
    // --- Function: Exchange the Authorization Code for an Access Token ---
    async function getToken(code) {
      const code_verifier = localStorage.getItem('code_verifier');
      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
           'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
           client_id: clientId,
           grant_type: 'authorization_code',
           code: code,
           redirect_uri: redirectUrl,
           code_verifier: code_verifier,
        }),
      });
      return await response.json();
    }
  
    // --- Function: Fetch User Data from Spotify ---
    async function getUserData() {
      const response = await fetch("https://api.spotify.com/v1/me", {
        method: 'GET',
        headers: {
           'Authorization': 'Bearer ' + accessToken,
        },
      });
      return await response.json();
    }
  
    // --- Click Handlers ---
    async function loginWithSpotifyClick() {
      await redirectToSpotifyAuthorize();
    }
  
    function logoutClick() {
      localStorage.clear();
      setAccessToken(null);
      setUserData(null);
      window.location.href = redirectUrl;
    }
  
    // --- Render UI ---
    // If no access token is available, display the login screen with your CSS visual layout.
    if (!accessToken) {
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
              <button className="login-button" onClick={loginWithSpotifyClick}>
                Log in
              </button>
            </div>
          </div>
        </div>
      );
    }
  
    // When logged in, display a simple welcome view using the same container styling.
    return (
      <div className="login-container">
        <div className="title-animation">
          <h1 className="flicker">impulse</h1>
        </div>
        <div style={{ textAlign: "center" }}>
          {userData ? (
            <>
              <h2>Welcome, {userData.display_name}!</h2>
              <p>User ID: {userData.id}</p>
              <button className="login-button" onClick={logoutClick}>
                Logout
              </button>
            </>
          ) : (
            <p>Loading your Spotify profile...</p>
          )}
        </div>
      </div>
    );
  }
  
  export default Login;
  