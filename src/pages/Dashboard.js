import React, { useEffect, useState } from "react";
import "../styles/dashboard.css";
import { Link } from "react-router-dom";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const Dashboard = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState(null);

  // MOVEMENT / APTOS CLIENT
  const aptos = new Aptos(
    new AptosConfig({
      network: Network.CUSTOM,
      fullnode: "https://testnet.movementnetwork.xyz/v1",
    })
  );

  // Load wallet from localStorage
  useEffect(() => {
    const savedAddress = localStorage.getItem("wallet_address");
    if (savedAddress) {
      setWalletAddress(savedAddress);
      fetchBalance(savedAddress);
    }
  }, []);

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

  // Connect wallet
  const connectWallet = async () => {
    try {
      if (!window.nightly?.aptos) {
        alert("Nightly Wallet not detected! Please install Nightly Wallet.");
        return;
      }

      const account = await window.nightly.aptos.connect();

      if (account?.address) {
        setWalletAddress(account.address);
        localStorage.setItem("wallet_address", account.address);
        fetchBalance(account.address);
      }
    } catch (error) {
      console.error(error);
      alert("Unable to connect Nightly Wallet.");
    }
  };

  // Faucet click handler (replace with actual faucet API)
  const handleFaucetClick = () => {
    alert("Testnet tokens requested! (implement faucet API here)");
  };

  return (
    <div className="dashboard-container">
      
      {/* WALLET SECTION */}
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
          </div>
        ) : (
          <button className="wallet-btn" onClick={connectWallet}>
            Connect Nightly Wallet
          </button>
        )}
      </div>

      {/* SERVICES SECTION */}
      <div className="services-section">
        <h3 className="section-title">Services</h3>
        <div className="cards-wrapper">
          <Link to="/airtime" className="dash-card">
            <i className="bi bi-phone"></i>
            <h4>Airtime</h4>
            <p>Top-up instantly using Move wallet</p>
          </Link>

          <Link to="/data" className="dash-card">
            <i className="bi bi-wifi"></i>
            <h4>Data</h4>
            <p>Crypto data bundles</p>
          </Link>

          <Link to="/cable" className="dash-card">
            <i className="bi bi-tv"></i>
            <h4>Cable TV</h4>
            <p>DSTV • GOTV • Startimes</p>
          </Link>

          <Link to="/nin-verification" className="dash-card verify">
            <i className="bi bi-shield-check"></i>
            <h4>NIN Verification</h4>
            <p>National ID verification</p>
          </Link>

          <Link to="/bvn-verification" className="dash-card verify">
            <i className="bi bi-fingerprint"></i>
            <h4>BVN Verification</h4>
            <p>Bank Verification Number</p>
          </Link>

          <Link to="/profile" className="dash-card">
            <i className="bi bi-person-circle"></i>
            <h4>Profile</h4>
            <p>View and edit your profile</p>
          </Link>

          <Link to="/transactions" className="dash-card">
            <i className="bi bi-receipt"></i>
            <h4>Transactions</h4>
            <p>View your transaction history</p>
          </Link>

          {/* Faucet as a card */}
          <div
  className="dash-card faucet-card"
  onClick={() =>
    window.open("https://faucet.testnet.movementnetwork.xyz/", "_blank")
  }
>
  <i className="bi bi-droplet"></i>
  <h4>Faucet</h4>
  <p>Click to get testnet token</p>
</div>

        </div>
      </div>
      
    </div>
  );
};

export default Dashboard;
