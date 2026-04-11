import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"
import { useUser } from "./UserContext";
import Swal from "sweetalert2";
import 'animate.css';
import api from "../api/api";


export default function Navbar() {
    const { user, logout, cartCount } = useUser()
    const [search, setSearch] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) return;

        const fetchCart = async () => {
            try {
                const token = localStorage.getItem("access");

                const res = await api.get("cart/")

            } catch (err) {
                console.log(err);
            }
        };

        fetchCart();
    }, [user]);

    const handleLogout = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You want to be logout from this account!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Logout"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Logged out  !",
                    text: "You are logged out your account",
                    icon: "success"
                })

                localStorage.clear()
                logout()
                navigate("/login")

            }
        });


    };

    const handleSearch = (e) => {
        e.preventDefault();

        if (!search.trim()) return;

        navigate(`/productlist?search=${encodeURIComponent(search)}`);
    };


    return (
        <nav className="nav" key={user ? user.id : "guest"}>
            <div className="nav-left">
                <h2 className="logo animate__animated animate__bounceInRight">Myshop</h2>
            </div>

            <form className="nav-search" onSubmit={handleSearch}>
                <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
                <button type="submit">Search</button>
            </form>

            <div className="nav-center">
                {user ? (
                    <>
                        <Link to="/" className="nav-link animate__animated animate__bounceInLeft">Home</Link>
                        <Link to="/productlist" className="nav-link animate__animated animate__bounceInLeft">Products</Link>
                        <Link to="/wishlist" className="nav-link animate__animated animate__bounceInLeft">Wishlist</Link>
                    </>
                ) : (
                    <>
                        <Link to="/" className="nav-link animate__animated animate__bounceInLeft">Home</Link>
                        <Link to="/productlist" className="nav-link animate__animated animate__bounceInLeft">Products</Link>
                    </>

                )}
            </div>

            <div className="nav-right">
                {user ? (
                    <>
                        <span className="nav-user animate__animated animate__bounceInUp">Hi, {user.username}</span>

                        <Link to="/cart" className="nav-cart animate__animated animate__bounceInUp">
                            Cart ({cartCount})
                        </Link>

                        <button onClick={handleLogout} className="nav-logout animate__animated animate__bounceInUp">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to='/login' className="nav-link animate__animated animate__bounceInUp">Login</Link>
                        <Link to='/register' className="nav-link animate__animated animate__bounceInUp">Register</Link>
                    </>
                )}
            </div>

        </nav>
    )
}
