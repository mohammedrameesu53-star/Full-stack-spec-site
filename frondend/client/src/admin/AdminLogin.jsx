import axios from "axios"
import { useState } from "react"
import './AdminLogin.css'
import Swal from "sweetalert2"
import api from "../api/adminApi"

export default function AdminLogin() {
    const [username, setUsername] = useState("")
    const [pass, setPass] = useState("")

    const handleLogin = async () => {

        try {
            const res = await api.post(
                "login/",
                {
                    username: username,
                    password: pass
                }
            )

            localStorage.setItem("adminToken", res.data.access);
            localStorage.setItem("adminRefresh", res.data.refresh);

            Swal.fire({
                title: "Login Successful",
                icon: "success"
            });

            window.location.href = "/admin/dashboard"

        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Invalid admin credentials!"
            });
        }
    }

    return (
        <div className="admin-container">
            <div className="admin-card">

                <h2>Admin Login</h2>
                <input type="username" placeholder="Username" onChange={(e) => setUsername(e.target.value)} value={username} className="admin-input" />
                <br />
                <br />
                <input type="password" placeholder="Password" onChange={(e) => setPass(e.target.value)} value={pass} className="admin-input" />
                <br />
                <br />
                <button className="admin-btn" onClick={handleLogin}>Login</button>

            </div>
        </div>
    )
}