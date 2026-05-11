import { useState } from "react";
import api from "../api/api";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2"; // Recommended for consistent alerts
import "./OTP.css"


export default function PasswordResetVerifyOTP() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("accounts/verify-reset-otp/", { email, otp });
      
      Swal.fire({
        title: "OTP Verified ✅",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });

      navigate("/new-password", { state: { email, otp } });
    } catch (err) {
      Swal.fire({
        title: "Invalid OTP ❌",
        text: "Please check the code and try again.",
        icon: "error"
      });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Enter OTP</h2>
        <p style={{ color: '#666', marginBottom: '1rem' }}>
          Verification code sent to:
        </p>
        
        <form onSubmit={handleSubmit}>
          <input 
            value={email} 
            disabled 
            style={{ textAlign: 'center', fontWeight: 'bold' }} 
          />

          <input
            placeholder="Enter 6-Digit OTP"
            onChange={(e) => setOtp(e.target.value)}
            required
            maxLength="6"
            style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '1.2rem' }}
          />

          <button type="submit">Verify OTP</button>
        </form>
      </div>
    </div>
  );
}