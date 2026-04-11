import { useEffect, useState } from "react";
import axios from "axios";
import AdminSideBar from "./AdminSidebar";
import "./AdminOrders.css";

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const loadOrders = async () => {
            const res = await axios.get("http://localhost:4000/users");

            const allOrders = [];
            res.data.forEach(user => {
                user.orders.forEach(order => {
                    allOrders.push({
                        orderId: order.orderId,
                        user: user.name,
                        total: order.total,
                        status: order.status
                    });
                });
            });

            setOrders(allOrders);
        };
        loadOrders();
    }, []);

    return (
        <div>
            <AdminSideBar />

            <div className="orders-container">
                <h1 className="orders-title">Manage Orders</h1>

                <div className="table-wrapper">
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>User</th>
                                <th>Total</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.map((o) => (
                                <tr key={o.orderId}>
                                    <td>{o.orderId}</td>
                                    <td>{o.user}</td>
                                    <td>₹{o.total}</td>
                                    <td>
                                        <span className={`status-badge ${o.status.toLowerCase()}`}>
                                            {o.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
