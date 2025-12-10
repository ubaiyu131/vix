import React, { useState } from "react";
import { AptosClient, TxnBuilderTypes, BCS, FaucetClient } from "aptos";
import "../styles/airtime.css";

const NODE_URL = "https://fullnode.testnet.aptoslabs.com/v1"; // Aptos testnet
const FAUCET_URL = "https://faucet.testnet.aptoslabs.com";   // For testing
const TEST_RECIPIENT = "0xYOUR_TEST_RECEIVER_ADDRESS";       // Replace with your test wallet

const client = new AptosClient(NODE_URL);
const faucetClient = new FaucetClient(NODE_URL, FAUCET_URL);

const BuyAirtime = () => {
  const [walletAddress, setWalletAddress] = useState("");

  const handleConnectWallet = async () => {
    if (!window.nightly || !window.nightly.aptos) {
      alert("Please install Nightly Wallet");
      return;
    }

    const account = await window.nightly.aptos.connect();
    if (account && account.address) {
      setWalletAddress(account.address);
    }
  };

  const handleBuyAirtime = async () => {
    if (!walletAddress) {
      alert("Connect your Nightly Wallet first!");
      return;
    }

    try {
      // Build payload: transfer 0.1 MOVE (0.1 * 10^8 because MOVE uses 8 decimals)
      const payload = {
        type: "entry_function_payload",
        function: "0x1::coin::transfer",
        type_arguments: ["0x1::aptos_coin::AptosCoin"],
        arguments: [TEST_RECIPIENT, "10000000"], // 0.1 MOVE = 0.1 * 10^8
      };

      const txn = await window.nightly.aptos.signAndSubmitTransaction(payload);
      console.log("Transaction submitted:", txn);

      alert(`Airtime purchase successful! Txn Hash: ${txn.hash}`);
    } catch (error) {
      console.error(error);
      alert("Transaction failed!");
    }
  };

  return (
    <div className="page-wrapper">
      <h2 className="page-title">Buy Airtime</h2>

      {!walletAddress ? (
        <button className="btn-primary" onClick={handleConnectWallet}>
          Connect Nightly Wallet
        </button>
      ) : (
        <div>
          <p>Wallet connected: {walletAddress.substring(0, 8)}...{walletAddress.slice(-6)}</p>
          <button className="btn-primary" onClick={handleBuyAirtime}>
            Buy Airtime (0.1 MOVE)
          </button>
        </div>
      )}
    </div>
  );
};

export default BuyAirtime;
