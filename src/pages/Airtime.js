import React, { useState } from "react";
import "../styles/airtime.css";

const Airtime = () => {
  const [network, setNetwork] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  // Submit Airtime Request
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        network: Number(network),
        phone,
        amount: Number(amount),
      };
      // Replace with your actual PHP endpoint
      const res = await fetch(
        "https://api.captainbayyu.com.ng/buyAirtime.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      console.log("API Response:", data);

      if (
        (data.status && data.status === true) ||
        (data.code && data.code === 200) ||
        (data.message && data.message.toLowerCase().includes("success"))
      ) {
        alert(
          `Airtime Purchase Successful!\nNetwork: ${network}\nPhone: ${phone}\nAmount: ₦${amount}`
        );
        setNetwork("");
        setPhone("");
        setAmount("");
      } else {
        alert("Failed: " + (data.message || "Unknown Error"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error connecting to server");
    }

    setLoading(false);
  };

  return (
    <div className="airtime-container">
      <h2 className="title">Buy Airtime</h2>

      <form className="form-box" onSubmit={handleSubmit}>
        <label>Network</label>
        <select
          className="input"
          value={network}
          onChange={(e) => setNetwork(e.target.value)}
          required
        >
          <option value="">Select Network</option>
          <option value="1">MTN</option>
          <option value="2">Airtel</option>
          <option value="3">Glo</option>
          <option value="4">9Mobile</option>
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

        <label>Amount (₦)</label>
        <input
          type="number"
          className="input"
          placeholder="100"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <button className="submit-btn" type="submit" disabled={loading}>
          {loading ? "Processing..." : "Buy Airtime"}
        </button>
      </form>
    </div>
  );
};

export default Airtime;
