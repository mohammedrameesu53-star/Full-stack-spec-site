import { useState } from "react";
import axios from "axios";
import './Register.css'
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";
import Swal from "sweetalert2";

export default function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: "", confirmpassword: "" })
    const [err, setErr] = useState({ name: "", email: "", password: "", confirmpassword: "" })
    const navigate = useNavigate()


    const handleSubmit = async (e) => {
        e.preventDefault()
        let errmessage = {}

        if (!form.name.trim()) {
            errmessage.name = "Name is required";
        }

        if (form.email.trim() === "") {
            errmessage.email = "Email is required!"
        }

        if (!form.password) {
            errmessage.password = "Password is required";
        }

        if (!form.confirmpassword) {
            errmessage.confirmpassword = "Confirmpassword is required"
        } else if (form.password !== form.confirmpassword) {
            errmessage.confirmpassword = "Password do not match"
        }

        if (Object.keys(errmessage).length > 0) {
            setErr(errmessage)
            return;
        }
        try{
        const res = await axios.post(
            "http://127.0.0.1:8000/api/accounts/register/",
            {
                username: form.name,
                email: form.email,
                password: form.password,
                confirm_password: form.confirmpassword
            }
        );

        
        Swal.fire({
            title: "OTP Sent!",
            text: "Check your email for verification code",
            icon: "success"
        });

        setForm({
            name: "",
            email: "",
            password: "",
            confirmpassword: ""
        });

        navigate('/verify-otp', {state: { user_id: res.data.user_id }});

    } catch (err) {
        console.log(err.response?.data);

        Swal.fire({
            title: "Registration failed",
            text: JSON.stringify(err.response?.data),
            icon: "error"
        });
    }
}

return (
    <div className="reg-container">
        <form onSubmit={handleSubmit} className="reg-box">
            <h2 className="reg-title">Create Account</h2>

            <input value={form.name} type="text" placeholder="username" onChange={(e) => setForm({ ...form, name: e.target.value })} className="reg-input" />
            <p className="reg-error">{err.name}</p>
            <input value={form.email} type="email" placeholder="email" onChange={(e) => setForm({ ...form, email: e.target.value })} className="reg-input" />
            <p className="reg-error">{err.email}</p>
            <input value={form.password} type="password" placeholder="password" onChange={(e) => setForm({ ...form, password: e.target.value })} className="reg-input" />
            <p className="reg-error">{err.password}</p>
            <input value={form.confirmpassword} type="password" placeholder="confirm password" onChange={(e) => setForm({ ...form, confirmpassword: e.target.value })} className="reg-input" />
            <p className="reg-error">{err.confirmpassword}</p>
            <button type="submit" className="reg-btn">Register</button>

        </form>
    </div>
)
}