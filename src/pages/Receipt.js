import React, { useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import "../styles/transactions.css";

const Receipt = () => {
  const { connected, account } = useWallet();
  const [walletAddress, setWalletAddress] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load wallet address
  useEffect(() => {
    const storedAddress = localStorage.getItem("wallet_address");
    if (storedAddress) setWalletAddress(storedAddress);
    else if (connected && account?.address) setWalletAddress(account.address);
  }, [connected, account]);

  // Fetch transactions
  useEffect(() => {
    if (!walletAddress) return;

    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "https://api.captainbayyu.com.ng/getTransactions.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ walletAddress }),
          }
        );

        const data = await res.json();
        if (data.status && Array.isArray(data.transactions)) {
          setTransactions(data.transactions);
        } else {
          console.error("Failed to fetch transactions:", data.message);
        }
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [walletAddress]);

  return (
    <div className="receipt-page">
      <h2 className="receipt-title">Transaction Receipt</h2>

      {loading ? (
        <p>Loading transactions...</p>
      ) : transactions.length === 0 ? (
        <p>No transactions found</p>
      ) : (
        transactions.map((t, i) => (
          <div key={i} className="receipt-card">
            <h3>Transaction #{i + 1}</h3>
            <p>
              <strong>Wallet Address:</strong> {t.wallet_address}
            </p>
            <p>
              <strong>Transaction Hash:</strong> {t.txn_hash}
            </p>
            <p>
              <strong>Type:</strong> {t.type || "Airtime Purchase"}
            </p>
            <p>
              <strong>Phone:</strong> {t.phone || "-"}
            </p>
            <p>
              <strong>Amount:</strong> ₦{t.amount}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`tx-status ${t.status}`}
                style={{ textTransform: "uppercase" }}
              >
                {t.status || "FAILED"}
              </span>
            </p>
            <p>
              <strong>Date:</strong> {t.created_at}
            </p>

            <button
              onClick={() => window.print()}
              className="receipt-print-btn"
            >
              Print Receipt
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Receipt;
