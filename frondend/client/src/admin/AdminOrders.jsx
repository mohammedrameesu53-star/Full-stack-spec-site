import { useEffect, useState } from "react";
import axios from "axios";
import AdminSideBar from "./AdminSidebar";
import "./AdminOrders.css";
import api from "../api/adminApi";

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const res = await api.get('orders/')
            setOrders(res.data)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <AdminSideBar />

            <div className="orders-container">
                <h1 className="orders-title">Manage Orders</h1>

                <div className="table-wrapper">

                    {loading ? (
                        <p>Loading orders...</p>
                    ) : (
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>User</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                {orders.map((o) => (
                                    <tr key={o.id}>
                                        <td>{o.id}</td>
                                        <td>{o.user}</td>
                                        <td>₹{o.total}</td>
                                        <td>
                                            <span className={`status-badge ${o.status.toLowerCase()}`}>
                                                {o.status}
                                            </span>
                                        </td>
                                        <td>
                                            {new Date(o.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                </div>
            </div>
        </div>
    );
}
