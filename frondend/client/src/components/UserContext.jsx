import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";

const UserContext = createContext();

export function UserProvider({ children }) {

    const [user, setUser] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const [loading, setLoading] = useState(true);

    // ✅ Load user from token
    useEffect(() => {
        const token = localStorage.getItem("access");
        if (token) {
            fetchUser()
            fetchCart()
        }

        setLoading(false);
    }, []);

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem("access");
            const res = await api.get("accounts/user/")
            setUser(res.data);
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const fetchCart = async () => {
        try {
            const token = localStorage.getItem("access");
            const res = await api.get("cart/");
            setCartCount(res.data.length);
        } catch (err) {
            console.log(err);
        }
    };


    const login = (data) => {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        fetchUser();
        fetchCart();
    };


    const logout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setUser(null);
        setCartCount(0);
    };

    return (
        <UserContext.Provider value={{
            user,
            setUser,
            cartCount,
            setCartCount,
            fetchCart,
            login,
            logout,
            loading
        }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}