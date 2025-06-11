// src/components/Login.js
import React from "react";
import "./Login.css";

const Login = ({ getAccessToken }) => {
  return (
    <div className="login-container">
      <div className="header-animation">
        <div className="soundwaves"></div>
        <h1 className="app-title">Impulse</h1>
      </div>
      <div className="cassette-player">
        <div className="tape">
          <button className="play-button" onClick={getAccessToken}>
            Log in
          </button>
        </div>
        <div className="headphones">
          <div className="headphone-left"></div>
          <div className="headphone-right"></div>
          <div className="cord"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
