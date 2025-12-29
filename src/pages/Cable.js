import React, { useState } from "react";
import "../styles/cable.css";

const Cable = () => {
  const [provider, setProvider] = useState("");
  const [smartCard, setSmartCard] = useState("");
  const [plan, setPlan] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Cable subscription submitted.");
  };

  return (
    <div className="cable-container">
      <h2 className="page-title">Cable Subscription</h2>

      <form className="card-box" onSubmit={handleSubmit}>
        <label>Provider</label>
        <select value={provider} onChange={(e) => setProvider(e.target.value)} required>
          <option value="">Select Provider</option>
          <option>DSTV</option>
          <option>GOTV</option>
          <option>Startimes</option>
        </select>

        <label>Smart Card Number</label>
        <input
          type="number"
          placeholder="Enter smart card number"
          value={smartCard}
          onChange={(e) => setSmartCard(e.target.value)}
          required
        />

        <label>Subscription Plan</label>
        <select value={plan} onChange={(e) => setPlan(e.target.value)} required>
          <option value="">Select Plan</option>
          <option>Basic</option>
          <option>Premium</option>
          <option>Family</option>
        </select>

        <button type="submit" className="btn-primary">Pay with Crypto</button>
      </form>

      {/* Airtime-style Footer */}
      <div className="cable-footer">
        <a href="/" className="footer-item">
          <i className="bi bi-house"></i>
          <span>Home</span>
        </a>

        <a href="/transactions" className="footer-item">
          <i className="bi bi-receipt"></i>
          <span>Transactions</span>
        </a>

        <div
          className="footer-item"
          onClick={() => window.open("https://faucet.movementnetwork.xyz/", "_blank")}
        >
          <i className="bi bi-droplet"></i>
          <span>Faucet</span>
        </div>
      </div>
    </div>
  );
};

export default Cable;
