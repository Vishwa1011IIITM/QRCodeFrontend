// src/components/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';  // Import Link from React Router

const HomePage = () => {
  return (
    <div className="home-page">
      <h1>Welcome to the QR Code Signing App</h1>
      <p>Use the options below to either sign a QR code or verify a signed QR code.</p>

      {/* Add Links to navigate to the Sign and Verify pages */}
      <div className="home-page-links">
        <div className="home-page-item">
          <h3>Sign a QR Code</h3>
          <p>Create a unique signed QR code for your product.</p>
          <Link to="/admin">
            <button className="home-page-button">Go to Admin Page</button>
          </Link>
        </div>

        <div className="home-page-item">
          <h3>Verify a QR Code</h3>
          <p>Verify a product’s authenticity by scanning its signed QR code.</p>
          <Link to="/verify">
            <button className="home-page-button">Go to Verification Page</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
