import React, { useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import "../styles/transactions.css";

const Transactions = () => {
  const { connected, account } = useWallet();
  const [walletAddress, setWalletAddress] = useState("");

  // Load wallet address from localStorage for display
  useEffect(() => {
    const storedAddress = localStorage.getItem("wallet_address");
    if (storedAddress) setWalletAddress(storedAddress);
    else if (connected && account?.address) setWalletAddress(account.address);
  }, [connected, account]);

  const history = [
    { type: "Airtime", amount: "₦500", status: "Success", date: "2025-01-10" },
    { type: "Data", amount: "₦1000", status: "Success", date: "2025-01-09" },
    { type: "Cable", amount: "₦3500", status: "Pending", date: "2025-01-08" },
  ];

  return (
    <div className="page-wrapper">

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

      <h2 className="page-title">Transaction History</h2>

      <div className="trans-list">
        {history.map((t, idx) => (
          <div key={idx} className="trans-card">
            <div>
              <h4>{t.type}</h4>
              <p className="date">{t.date}</p>
            </div>

            <div className="right-area">
              <p className="amount">{t.amount}</p>
              <span className={`status ${t.status.toLowerCase()}`}>
                {t.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Transactions;
