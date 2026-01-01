import React, { useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { toast, Toaster } from "sonner";
import "../styles/airtime.css";

export default function AirtimeWithMove() {
  const {
    account,
    signAndSubmitTransaction,
    network,
    connect,
    disconnect,
    wallets,
  } = useWallet();

  const [walletAddress, setWalletAddress] = useState("");
  const [networkValue, setNetworkValue] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /* -------------------- CONNECT WALLET -------------------- */
  const handleConnectWallet = async () => {
    try {
      if (!wallets || wallets.length === 0) {
        toast.error("No Aptos wallet detected");
        return;
      }

      // ✅ Prefer Nightly
      const nightly = wallets.find(
        (w) => w.name.toLowerCase() === "nightly"
      );

      const walletToUse = nightly ?? wallets[0];

      await connect(walletToUse.name);
      toast.success(`${walletToUse.name} wallet connected`);
    } catch (err) {
      toast.error("Wallet connection cancelled");
    }
  };

  /* -------------------- DISCONNECT WALLET -------------------- */
  const handleDisconnectWallet = async () => {
    try {
      await disconnect();
      localStorage.removeItem("wallet_address");
      setWalletAddress("");
      toast.success("Wallet disconnected");
    } catch {
      toast.error("Failed to disconnect wallet");
    }
  };

  /* -------------------- CONFIG -------------------- */
  const TREASURY_ADDRESS =
    "0xaed38c636c9497b30090ea85394c4e84194d6677ff52e094fafd385ab73a4b57";

  const MOVEMENT_CONFIGS = {
    mainnet: {
      chainId: 126,
      fullnode: "https://full.mainnet.movementinfra.xyz/v1",
      explorer: "mainnet",
    },
    testnet: {
      chainId: 250,
      fullnode: "https://testnet.movementnetwork.xyz/v1",
      explorer: "testnet",
    },
  };

  const getCurrentNetworkConfig = () => {
    if (network?.chainId === 126) return MOVEMENT_CONFIGS.mainnet;
    if (network?.chainId === 250) return MOVEMENT_CONFIGS.testnet;
    return MOVEMENT_CONFIGS.testnet;
  };

  const getAptosClient = () => {
    const cfg = getCurrentNetworkConfig();
    return new Aptos(
      new AptosConfig({ network: Network.CUSTOM, fullnode: cfg.fullnode })
    );
  };

  const getExplorerUrl = (hash) => {
    const cfg = getCurrentNetworkConfig();
    return `https://explorer.movementnetwork.xyz/txn/${hash}?network=${cfg.explorer}`;
  };

  /* -------------------- LOAD WALLET ADDRESS -------------------- */
  useEffect(() => {
    const stored = localStorage.getItem("wallet_address");
    if (stored && typeof stored === "string") {
      setWalletAddress(stored);
    }
  }, []);

  useEffect(() => {
    if (account?.address) {
      const addr = String(account.address);
      localStorage.setItem("wallet_address", addr);
      setWalletAddress(addr);
    }
  }, [account]);

  /* -------------------- BUY AIRTIME -------------------- */
  const handleBuyAirtime = async (e) => {
    e.preventDefault();

    if (!account) {
      toast.error("Please connect wallet first");
      return;
    }

    if (!networkValue || !phone || !amount) {
      toast.error("Please fill all fields");
      return;
    }

    setIsLoading(true);
    const t = toast.loading("Confirming transaction...");

    try {
      const response = await signAndSubmitTransaction({
        data: {
          function: "0x1::aptos_account::transfer",
          functionArguments: [TREASURY_ADDRESS, 1_000_000],
        },
      });

      const aptos = getAptosClient();
      await aptos.waitForTransaction({ transactionHash: response.hash });

      toast.success("Payment successful!", {
        id: t,
        action: {
          label: "View",
          onClick: () =>
            window.open(getExplorerUrl(response.hash), "_blank"),
        },
      });

      const res = await fetch(
        "https://api.captainbayyu.com.ng/buyAirtime.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            network: Number(networkValue),
            phone,
            amount: Number(amount),
          }),
        }
      );

      const data = await res.json();

      const txnStatus =
        data?.status === true ||
        data?.code === 200 ||
        data?.message?.toLowerCase().includes("success")
          ? "success"
          : "failed";

      if (txnStatus === "success") {
        toast.success(`Airtime successful! ₦${amount}`);
        setNetworkValue("");
        setPhone("");
        setAmount("");
      } else {
        toast.error("Airtime failed");
      }

      await fetch("https://api.captainbayyu.com.ng/transaction.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress,
          network: networkValue,
          phone,
          amount,
          txnHash: response.hash,
          status: txnStatus,
        }),
      });
    } catch (err) {
      console.error(err);
      toast.error("Transaction cancelled or failed", { id: t });
    } finally {
      setIsLoading(false);
    }
  };

  const shortAddress =
    typeof walletAddress === "string" && walletAddress.length > 10
      ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
      : "";

  /* -------------------- UI -------------------- */
  return (
    <div className="airtime-container">
      <Toaster richColors />

      {shortAddress && (
        <div style={{ marginBottom: 15, textAlign: "center" }}>
          <button className="wallet-pill">
            Connected: {shortAddress}
          </button>
        </div>
      )}

      <div style={{ textAlign: "center", marginBottom: 20 }}>
        {account ? (
          <button onClick={handleDisconnectWallet} className="disconnect-btn">
            Disconnect Wallet
          </button>
        ) : (
          <button onClick={handleConnectWallet} className="connect-btn">
            Connect Nightly Wallet
          </button>
        )}
      </div>

      <h2 className="title">Buy Airtime</h2>

      <form className="form-box" onSubmit={handleBuyAirtime}>
        <label>Network</label>
        <select
          className="input"
          value={networkValue}
          onChange={(e) => setNetworkValue(e.target.value)}
        >
          <option value="">Select Network</option>
          <option value="1">MTN</option>
          <option value="2">Airtel</option>
          <option value="3">Glo</option>
          <option value="4">9Mobile</option>
        </select>

        <label>Phone Number</label>
        <input
          className="input"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <label>Amount (₦)</label>
        <input
          type="number"
          className="input"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button className="submit-btn" disabled={isLoading}>
          {isLoading ? "Processing..." : "Buy Airtime (0.5 MOVE)"}
        </button>
      </form>
      {/* Footer */}
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
