import { useState } from "react";
import api from "../api/api";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

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

      Swal.fire({
        title: "Success!",
        text: "Password reset successful ✅",
        icon: "success"
      });
      
      navigate("/login");
    } catch {
      Swal.fire({
        title: "Error",
        text: "Error resetting password. Please try again.",
        icon: "error"
      });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Set New Password</h2>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          Choose a strong password for your account.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
          />

          <button type="submit">Update Password</button>
        </form>
      </div>
    </div>
  );
}