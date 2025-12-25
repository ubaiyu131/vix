import React, { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { toast, Toaster } from "sonner";
import "../styles/airtime.css";

export default function AirtimeWithMove() {
  const { wallets, connect, connected, account, signAndSubmitTransaction, network } = useWallet();

  const [networkValue, setNetworkValue] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const TREASURY_ADDRESS = "0xaed38c636c9497b30090ea85394c4e84194d6677ff52e094fafd385ab73a4b57";

  const MOVEMENT_CONFIGS = {
    mainnet: { chainId: 126, fullnode: "https://full.mainnet.movementinfra.xyz/v1", explorer: "mainnet" },
    testnet: { chainId: 250, fullnode: "https://testnet.movementnetwork.xyz/v1", explorer: "testnet" },
  };

  const getCurrentNetworkConfig = () => {
    if (network?.chainId === 126) return MOVEMENT_CONFIGS.mainnet;
    if (network?.chainId === 250) return MOVEMENT_CONFIGS.testnet;
    return MOVEMENT_CONFIGS.testnet;
  };

  const getAptosClient = () => {
    const cfg = getCurrentNetworkConfig();
    return new Aptos(new AptosConfig({ network: Network.CUSTOM, fullnode: cfg.fullnode }));
  };

  const getExplorerUrl = (hash) => {
    const cfg = getCurrentNetworkConfig();
    return `https://explorer.movementnetwork.xyz/txn/${hash}?network=${cfg.explorer}`;
  };

  // Connect Nightly Wallet
  const handleConnectNightly = async () => {
    try {
      const nightlyWallet = wallets.find((w) => w.name.toLowerCase().includes("nightly"));
      if (!nightlyWallet) return toast.error("Nightly Wallet not found. Install it first.");
      await connect(nightlyWallet.name);
      toast.success("Nightly Wallet connected!");
    } catch (err) {
      toast.error("Failed to connect Nightly Wallet");
      console.error(err);
    }
  };

  // Handle payment + airtime
  const handleBuyAirtime = async (e) => {
    e.preventDefault();
    if (!connected || !account) return toast.error("Connect your Nightly Wallet first");

    if (!networkValue || !phone || !amount) return toast.error("Fill all fields");

    setIsLoading(true);
    const t = toast.loading("Sending 0.5 MOVE payment...");

    try {
      // Send 0.5 MOVE = 50,000,000 octas
      const response = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: "0x1::aptos_account::transfer",
          functionArguments: [TREASURY_ADDRESS, 1000000],
        },
      });

      const aptos = getAptosClient();
      await aptos.waitForTransaction({ transactionHash: response.hash });

      toast.success("Payment successful!", {
        id: t,
        action: {
          label: "View",
          onClick: () => window.open(getExplorerUrl(response.hash), "_blank"),
        },
      });

      // Call Airtime API after payment success
      const payload = {
        network: Number(networkValue),
        phone,
        amount: Number(amount),
      };

      const res = await fetch("https://api.captainbayyu.com.ng/buyAirtime.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log("API Response:", data);

      if ((data.status && data.status === true) || (data.code && data.code === 200) || (data.message && data.message.toLowerCase().includes("success"))) {
        alert(`Airtime Purchase Successful!\nNetwork: ${networkValue}\nPhone: ${phone}\nAmount: ₦${amount}`);
        setNetworkValue("");
        setPhone("");
        setAmount("");
      } else {
        alert("Airtime purchase failed: " + (data.message || "Unknown error"));
      }

    } catch (err) {
      toast.error(err?.message || "Transaction failed", { id: t });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="airtime-container">
      <Toaster richColors />

      {/* Wallet Status */}
      <div style={{ marginBottom: 20 }}>
        <button
          style={{
            width: "100%",
            padding: 10,
            cursor: "default",
            backgroundColor: connected ? "#4CAF50" : "#f44336",
            color: "#fff",
            border: "none",
            borderRadius: 5,
          }}
        >
          {connected ? `Connected: ${account.address}` : "Wallet not connected"}
        </button>
      </div>

      {!connected && (
        <button
          onClick={handleConnectNightly}
          disabled={isLoading}
          style={{ width: "100%", padding: 10, marginBottom: 12, cursor: "pointer" }}
        >
          {isLoading ? "Connecting..." : "Connect Nightly Wallet"}
        </button>
      )}

      <h2 className="title">Buy Airtime</h2>

      <form className="form-box" onSubmit={handleBuyAirtime}>
        <label>Network</label>
        <select className="input" value={networkValue} onChange={(e) => setNetworkValue(e.target.value)} required>
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

        {connected && (
          <button className="submit-btn" type="submit" disabled={isLoading}>
            {isLoading ? "Processing..." : "Buy Airtime (0.5 MOVE)"}
          </button>
        )}
      </form>
    </div>
  );
}
