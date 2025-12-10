import React, { useState } from "react";
import "../styles/data.css";

const Data = () => {
  const [network, setNetwork] = useState("");
  const [phone, setPhone] = useState("");
  const [plan, setPlan] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Buying ${plan} data on ${network} for ${phone}`);
  };

  return (
    <div className="data-container">
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
    </div>
  );
};

export default Data;
