import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("accounts/password-reset/", { email });

      alert("OTP sent to email");

      navigate("/verify-otp/reset", { state: { email } });

    } catch (error) {
      alert("Error sending OTP");
    }
  };


  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Reset Password</h2>
        <p style={{ color: '#666', marginBottom: '1rem' }}>We'll send a reset link to your email</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="name@example.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send OTP</button>
        </form>
      </div>
    </div>
  );
}

