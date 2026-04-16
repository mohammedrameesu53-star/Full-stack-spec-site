import { useState } from "react";
import api from "../api/api";
import { useNavigate, useLocation } from "react-router-dom";

export default function NewPassword() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const otp = location.state?.otp;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("accounts/password-reset-confirm/", {
        email,
        otp,
        password
      });

      alert("Password reset successful ✅");
      navigate("/login");

    } catch {
      alert("Error resetting password");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Set New Password</h2>

      <input
        type="password"
        placeholder="New Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Update Password</button>
    </form>
  );
}