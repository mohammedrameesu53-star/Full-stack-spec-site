import { useState } from "react";
import api from "../api/api";
import { useNavigate, useLocation } from "react-router-dom";

export default function PasswordResetVerifyOTP() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("accounts/verify-reset-otp/", {
        email,
        otp
      });

      alert("OTP Verified ✅");

      // 👉 go to password page
      navigate("/new-password", { state: { email, otp } });

    } catch (err) {
      alert("Invalid OTP ❌");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Enter OTP</h2>

      <input value={email} disabled />

      <input
        placeholder="Enter OTP"
        onChange={(e) => setOtp(e.target.value)}
      />

      <button type="submit">Verify OTP</button>
    </form>
  );
}