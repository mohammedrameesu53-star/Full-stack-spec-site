import axios from "axios"
import { useState } from "react"
import './AdminLogin.css'
import Swal from "sweetalert2"

export default function AdminLogin() {
    const [email, setEmail] = useState("")
    const [pass, setPass] = useState("")

    const handleLogin = async () => {
        const res = await axios.get("http://localhost:4000/admin")
        const admin = res.data[0];
 
        if (email === admin.email && pass === admin.password) {
            localStorage.setItem("admin", JSON.stringify({ email }))
            window.location.href = "/admin/dashboard"
            
        } else {
            alert("Invalid admin credentials")
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
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} value={email} className="admin-input" />
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