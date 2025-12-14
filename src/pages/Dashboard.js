import React, { useState } from "react";
import "../styles/dashboard.css";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const navigate = useNavigate();

  // ============================
  // CONNECT NIGHTLY MOVE WALLET
  // ============================
  const connectWallet = async () => {
    try {
      if (!window.nightly || !window.nightly.aptos) {
        alert("Nightly Wallet not detected! Please install Nightly Wallet extension.");
        return;
      }

      // Request connection
      const account = await window.nightly.aptos.connect();

      if (account && account.address) {
        setWalletAddress(account.address);

        // Save for later use
        localStorage.setItem("wallet_address", account.address);
      }
    } catch (error) {
      console.log(error);
      alert("Unable to connect to Nightly Wallet.");
    }
  };

  // ============================
  // LOGOUT FUNCTION
  // ============================
  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("wallet_address");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">

      {/* Top Navigation */}
      <div className="top-nav">
        <h2 className="brand">VixPay Web3</h2>

        {walletAddress ? (
          <button className="wallet-btn connected">
            {walletAddress.substring(0, 8)}...{walletAddress.slice(-6)}
          </button>
        ) : (
          <button className="wallet-btn" onClick={connectWallet}>
            Connect Nightly Wallet
          </button>
        )}
      </div>

      {/* Dashboard Cards */}
      <div className="cards-wrapper">

        <Link to="/airtime" className="dash-card">
          <i className="bi bi-phone"></i>
          <h4>Buy Airtime</h4>
          <p>Top-up instantly using Move wallet</p>
        </Link>

        <Link to="/data" className="dash-card">
          <i className="bi bi-wifi"></i>
          <h4>Buy Data</h4>
          <p>Crypto data bundles via Aptos</p>
        </Link>

        <Link to="/cable" className="dash-card">
          <i className="bi bi-tv"></i>
          <h4>Cable Subscription</h4>
          <p>DSTV • GOTV • Startimes</p>
        </Link>

      </div>

      {/* Bottom Action Buttons */}
      <div className="dashboard-actions">
  <Link to="/transactions" className="action-btn">
    <i className="bi bi-receipt"></i>
    <span>Transactions</span>
  </Link>

  <Link to="/profile" className="action-btn">
    <i className="bi bi-person-circle"></i>
    <span>Profile</span>
  </Link>

  <button className="action-btn logout-btn" onClick={handleLogout}>
    <i className="bi bi-box-arrow-right"></i>
    <span>Logout</span>
  </button>
</div>


    </div>
  );
};

export default Dashboard;
