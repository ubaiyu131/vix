import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo2.jpg";
import "../styles/login.css";

const Login = () => {
  const navigate = useNavigate();
  const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID"; // Replace with your real client ID

  // ======================
  // Google Login Handler
  // ======================
  const handleGoogleLogin = (response) => {
    if (response.credential) {
      localStorage.setItem("auth_token", response.credential);
      navigate("/dashboard");
    } else {
      alert("Google login failed");
    }
  };

  // ======================
  // Dynamically Load Google Script & Initialize
  // ======================
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      /* global google */
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleLogin,
      });

      google.accounts.id.renderButton(
        document.getElementById("googleBtn"),
        {
          theme: "filled_blue",
          size: "large",
          width: "100%",
        }
      );
    };
    document.body.appendChild(script);

    // Cleanup
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // ======================
  // Wallet login (dummy)
  // ======================
  const handleWalletLogin = () => {
    alert("Wallet login coming soon...");
    navigate("/dashboard");
  };

  return (
    <div className="login-container">
      <div className="card p-4">
        <div className="text-center mb-3">
          <div className="profile-container">
            <img src={logo} className="profile-pic mb-3" alt="Logo" />
          </div>
          <h4>Welcome Back</h4>
          <p className="text-muted">Login with Gmail or your Crypto Wallet</p>
        </div>

        {/* Google Login Button */}
        <div id="googleBtn" className="w-100 mb-3"></div>

        {/* Wallet Login Button */}
        <button
          className="wallet-btn w-100 mt-3"
          onClick={handleWalletLogin}
        >
          🔐 Login with Wallet
        </button>
      </div>
    </div>
  );
};

export default Login;
