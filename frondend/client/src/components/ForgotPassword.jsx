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
    <form onSubmit={handleSubmit}>
      <h2>Reset Password</h2>
      <input
        type="email"
        placeholder="Enter email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Send OTP</button>
    </form>
  );
}