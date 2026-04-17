import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../api/api";

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
        <div>
            <h2>Enter OTP</h2>
            <form onSubmit={handleVerify}>
                <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />
                <button type="submit">Verify</button>
            </form>
        </div>
    );
}