import { useEffect, useState } from "react";
import AdminSideBar from "./AdminSidebar";
import './UserManagement.css';
import api from "../api/adminApi";

export default function UserManagement() {
    const [user, setUser] = useState([])
 
    const loadUser = async () => {
        try {
            const res = await api.get('users/')
            setUser(res.data);
        } catch (err) {
            console.log(err)
        }

    }

    useEffect(() => {
        loadUser();
    }, [])

    const handleToggle = async (id) => {
        try {
            await api.patch(`/users/toggle/${id}/`);
            loadUser();
        } catch (err) {
            console.log(err);
        }
    };
    
    return (
        <div className="um-container">
            <AdminSideBar />

            <div className="um-content">
                <h1>User Managemant</h1>
                <div className="table-wrapper">
                    < table className="um-table">
                        <thead>
                            <tr>
                                <th>UserId</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Wishlist</th>
                                <th>Cart</th>
                                <th>Order</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {user.map((u) => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.wishlist}</td>
                                    <td>{u.cart}</td>
                                    <td>{u.order}</td>
                                    <td>
                                        {u.is_active ? (
                                            <span className="active-status">Active</span>
                                        ) : (
                                            <span className="blocked-status">Blocked</span>
                                        )}
                                    </td>

                                    <td>
                                        <button onClick={() => handleToggle(u.id)}>
                                            {u.is_active ? "Block" : "Activate"}
                                        </button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>


                    </table>
                </div>


            </div>

        </div>

    )
}