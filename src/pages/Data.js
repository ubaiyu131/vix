import React, { useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import "../styles/data.css";

const Data = () => {
  const { connected, account } = useWallet();
  const [walletAddress, setWalletAddress] = useState("");

  const [network, setNetwork] = useState("");
  const [phone, setPhone] = useState("");
  const [plan, setPlan] = useState("");

  // Load wallet address for display
  useEffect(() => {
    const storedAddress = localStorage.getItem("wallet_address");
    if (storedAddress) setWalletAddress(storedAddress);
    else if (connected && account?.address) setWalletAddress(account.address);
  }, [connected, account]);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Buying ${plan} data on ${network} for ${phone}`);
  };

  return (
    <div className="data-container">
      {/* Wallet Address Card */}
      {walletAddress && (
        <div style={{ marginBottom: 20, textAlign: "center" }}>
          <button
            style={{
              width: "fit-content",
              minWidth: 220,
              padding: "10px 20px",
              cursor: "default",
              backgroundColor: "#be1d2d",
              color: "#fff",
              border: "none",
              borderRadius: 25,
              fontWeight: 600,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </button>
        </div>
      )}

      <h2 className="title">Buy Data</h2>

      <form className="form-box" onSubmit={handleSubmit}>
        <label>Network</label>
        <select
          className="input"
          value={network}
          onChange={(e) => setNetwork(e.target.value)}
          required
        >
          <option value="">Select Network</option>
          <option value="MTN">MTN</option>
          <option value="Airtel">Airtel</option>
          <option value="Glo">Glo</option>
          <option value="9Mobile">9Mobile</option>
        </select>

        <label>Phone Number</label>
        <input
          type="text"
          className="input"
          placeholder="08012345678"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <label>Data Plan</label>
        <select
          className="input"
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          required
        >
          <option value="">Select Plan</option>
          <option value="500MB – ₦150">500MB – ₦150</option>
          <option value="1GB – ₦300">1GB – ₦300</option>
          <option value="2GB – ₦500">2GB – ₦500</option>
          <option value="5GB – ₦1200">5GB – ₦1200</option>
        </select>

        <button className="submit-btn" type="submit">
          Proceed to Pay
        </button>
      </form>

      {/* Footer */}
      <div className="data-footer">
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

export default Data;
