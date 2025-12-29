import React, { useState, useEffect } from "react";
import "../styles/dashboard.css";
import { Link } from "react-router-dom";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const Dashboard = () => {
  const [walletAddress, setWalletAddress] = useState(
    localStorage.getItem("wallet_address") || ""
  );
  const [walletBalance, setWalletBalance] = useState(null);

  const aptos = new Aptos(
    new AptosConfig({
      network: Network.CUSTOM,
      fullnode: "https://testnet.movementnetwork.xyz/v1",
    })
  );

  // Fetch balance
  const fetchBalance = async (address) => {
    try {
      const resource = await aptos.getAccountResource({
        accountAddress: address,
        resourceType: "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>",
      });

      const octas = resource.coin.value;
      const move = Number(octas) / 1e8;
      setWalletBalance(move);
    } catch (err) {
      console.error("Balance fetch failed:", err);
      setWalletBalance(0);
    }
  };

  // Connect Nightly Wallet
  const connectWallet = async () => {
    try {
      if (window.nightly?.aptos) {
        const account = await window.nightly.aptos.connect();
        if (account?.address) {
          setWalletAddress(account.address);
          localStorage.setItem("wallet_address", account.address);
          fetchBalance(account.address);
        }
      } else {
        alert(
          "Nightly Wallet not detected! On mobile, WalletConnect or deep linking is required."
        );
      }
    } catch (error) {
      console.error("Unable to connect Nightly Wallet:", error);
      alert("Unable to connect Nightly Wallet.");
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setWalletBalance(null);
    setWalletAddress("");
    localStorage.removeItem("wallet_address");
  };

  // Auto-fetch balance
  useEffect(() => {
    if (walletAddress) {
      fetchBalance(walletAddress);
    }
  }, [walletAddress]);

  return (
    <div className="dashboard-container">
      {/* ================= WALLET SECTION ================= */}
      <div className="wallet-section">
        <h2 className="brand">VixPay Web3</h2>

        {walletAddress ? (
          <div className="wallet-card">
            <div className="wallet-address">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </div>
            <div className="wallet-balance">
              {walletBalance !== null
                ? `${walletBalance.toFixed(3)} MOVE`
                : "Loading..."}
            </div>
            <button
              className="wallet-disconnect-btn"
              onClick={disconnectWallet}
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button className="wallet-btn" onClick={connectWallet}>
            Connect Nightly Wallet
          </button>
        )}
      </div>

      {/* ================= SERVICES SECTION ================= */}
      <div className="services-section">
        <h3 className="section-title">Services</h3>

        <div className="cards-wrapper">
          <Link to="/airtime" className="dash-card">
            <i className="bi bi-phone"></i>
            <h3>Airtime</h3>
            <p>Top-up instantly using Move wallet</p>
          </Link>

          <Link to="/data" className="dash-card">
            <i className="bi bi-wifi"></i>
            <h3>Data</h3>
            <p>Crypto data bundles</p>
          </Link>

          <Link to="/cable" className="dash-card">
            <i className="bi bi-tv"></i>
            <h3>Cable TV</h3>
            <p>DSTV • GOTV • Startimes</p>
          </Link>
        </div>
      </div>

      {/* ================= MOBILE FOOTER ================= */}
      <div className="mobile-footer">
        <Link to="/" className="footer-item">
          <i className="bi bi-house"></i>
          <span>Home</span>
        </Link>

        <Link to="/transactions" className="footer-item">
          <i className="bi bi-receipt"></i>
          <span>Transactions</span>
        </Link>

        <div
          className="footer-item"
          onClick={() =>
            window.open(
              "https://faucet.movementnetwork.xyz/",
              "_blank"
            )
          }
        >
          <i className="bi bi-droplet"></i>
          <span>Faucet</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
