import React from "react";
import "../styles/transactions.css";

const Transactions = () => {
  const history = [
    { type: "Airtime", amount: "₦500", status: "Success", date: "2025-01-10" },
    { type: "Data", amount: "₦1000", status: "Success", date: "2025-01-09" },
    { type: "Cable", amount: "₦3500", status: "Pending", date: "2025-01-08" },
  ];

  return (
    <div className="page-wrapper">
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
