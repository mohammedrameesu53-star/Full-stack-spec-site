import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../api/api";
import "./OTP.css"


export default function VerifyOTP() {
    const [otp, setOtp] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    const user_id = location.state?.user_id;

    const handleVerify = async (e) => {
        e.preventDefault();

        try {
            await api.post(
                "accounts/verify-otp/",
                {
                    user_id,
                    otp
                }
            );

            Swal.fire({
                title: "Verified!",
                icon: "success"
            });

            navigate("/login");

        } catch (err) {
            Swal.fire({
                title: "Invalid OTP",
                icon: "error"
            });
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Verify your Email</h2>
                <p style={{ color: '#666', marginBottom: '1rem' }}>Enter the code sent to your inbox</p>
                <form onSubmit={handleVerify}>
                    <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength="6"
                    />
                    <button type="submit">Verify Account</button>
                </form>
            </div>
        </div>
    );
}