import React, { useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { toast, Toaster } from "sonner";
import "../styles/airtime.css";

export default function AirtimeWithMove() {
  const { connected, account, signAndSubmitTransaction, network } = useWallet();

  const [walletAddress, setWalletAddress] = useState("");
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

  useEffect(() => {
    const storedAddress = localStorage.getItem("wallet_address");
    if (storedAddress) setWalletAddress(storedAddress);
  }, []);

  const handleBuyAirtime = async (e) => {
    e.preventDefault();

    if (!connected || !account) return toast.error("Wallet not connected! Connect via Dashboard first.");
    if (!networkValue || !phone || !amount) return toast.error("Please fill all fields");

    setIsLoading(true);
    const t = toast.loading("Sending 0.5 MOVE payment...");

    try {
      // 1️⃣ Sign and submit MOVE payment
      const response = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: "0x1::aptos_account::transfer",
          functionArguments: [TREASURY_ADDRESS, 1000000], // 0.5 MOVE in octas
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

      // 2️⃣ Call Airtime API
      const airtimePayload = { network: Number(networkValue), phone, amount: Number(amount) };
      const res = await fetch("https://api.captainbayyu.com.ng/buyAirtime.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(airtimePayload),
      });
      const data = await res.json();
      console.log("Airtime API Response:", data);

      // 3️⃣ Determine status based on Airtime API response
      let txnStatus = "failed";
      if (
        (data.status && data.status === true) ||
        (data.code && data.code === 200) ||
        (data.message && data.message.toLowerCase().includes("success"))
      ) {
        txnStatus = "success";
        toast.success(`Airtime Purchase Successful!\nNetwork: ${networkValue}\nPhone: ${phone}\nAmount: ₦${amount}`);
        setNetworkValue("");
        setPhone("");
        setAmount("");
      } else {
        toast.error("Airtime purchase failed: " + (data.message || "Unknown error"));
      }

      // 4️⃣ Save transaction to PHP backend
      try {
        await fetch("https://api.captainbayyu.com.ng/transaction.php", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    walletAddress: walletAddress,
    network: networkValue,
    phone: phone,
    amount: amount,
    txnHash: response.hash,
    status: txnStatus
  }),
});

        console.log("Transaction saved to database via PHP");
      } catch (err) {
        console.error("Failed to save transaction:", err);
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

      <h2 className="title">Buy Airtime</h2>

      <form className="form-box" onSubmit={handleBuyAirtime}>
        <label>Network</label>
        <select
          className="input"
          value={networkValue}
          onChange={(e) => setNetworkValue(e.target.value)}
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

        <button className="submit-btn" type="submit" disabled={isLoading}>
          {isLoading ? "Processing..." : "Buy Airtime (0.5 MOVE)"}
        </button>
      </form>

      {/* Airtime Footer */}
      <div className="airtime-footer">
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
          onClick={() =>
            window.open("https://faucet.movementnetwork.xyz/", "_blank")
          }
        >
          <i className="bi bi-droplet"></i>
          <span>Faucet</span>
        </div>
      </div>
    </div>
  );
}
