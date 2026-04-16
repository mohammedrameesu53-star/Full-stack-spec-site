import { useState } from "react";
import axios from "axios";
import './Login.css'
import { useNavigate } from "react-router-dom";
import { Link } from "lucide-react";
import { useUser } from "./UserContext";
import Swal from "sweetalert2";
import api from "../api/api";
export default function Login() {

    const [form, setForm] = useState({ username: "", password: "" })
    const [err, setErr] = useState("")
    const navigate = useNavigate()
    const { login } = useUser();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post(
                "accounts/login/",
                {
                    username: form.username,
                    password: form.password
                }
            );


            login(res.data);

            Swal.fire({
                title: "Login successful!",
                icon: "success"
            });

            navigate('/');

        } catch (error) {
            setErr("Invalid username or password");
        }
    };

    return (
        <div className="login-container">
            <form className="login-box" onSubmit={handleSubmit}>
                <h2 className="login-title">Login</h2>

                <input
                    type="text"
                    placeholder="username"
                    className="login-input"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="password"
                    className="login-input"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button type="submit" className="login-btn">Login</button>
                <p className="error-msg">{err}</p>
                <p><a style={{ color: "blue", cursor: "pointer" }} onClick={() => navigate("/register")}>Create new account</a> or <a style={{ color: "blue", cursor: "pointer" }} onClick={() => navigate("/forgot-password")}>Forgot Password?</a></p>
            </form>
        </div>
    )
}