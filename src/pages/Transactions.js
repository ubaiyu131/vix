import React, { useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useNavigate } from "react-router-dom"; // import inside
import "../styles/transactions.css";

const Transactions = () => {
  const { connected, account } = useWallet();
  const navigate = useNavigate(); // must be inside component
  const [walletAddress, setWalletAddress] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get wallet address
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
        const res = await fetch("https://api.captainbayyu.com.ng/getTransactions.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ walletAddress }),
        });

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
    <div className="tx-page">
      <h2 className="tx-title">Transactions</h2>

      {loading ? (
        <p>Loading transactions...</p>
      ) : transactions.length === 0 ? (
        <p>No transactions found</p>
      ) : (
        <div className="tx-list">
          {transactions.map((t, i) => (
            <div key={i} className="tx-row">
              {/* Icon */}
              <div className="tx-icon">💸</div>

              {/* Details */}
              <div className="tx-details">
                <h4>Transaction</h4>
                <p className="tx-desc">₦{t.amount} for {t.phone || t.wallet_address}</p>
                <p className="tx-date">{t.created_at}</p>
              </div>

              {/* Status + Print */}
              <div className="tx-right">
                <span className={`tx-status ${t.status}`}>
                  {t.status ? t.status.toUpperCase() : "FAILED"}
                </span>

                <button
                  className="tx-print"
                  onClick={() => navigate("/receipt", { state: { transaction: t } })}
                >
                  Print receipt
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Transactions;
