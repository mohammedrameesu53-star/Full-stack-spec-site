import { useEffect, useState } from "react";
import AdminSideBar from "./AdminSidebar";
import axios from "axios";
import './UserManagement.css'

export default function UserManagement() {
    const [user, setUser] = useState([])
    useEffect(() => {
        axios.get("http://localhost:4000/users")
            .then((res) => setUser(res.data))
    }, [])

    const loadUser = async () => {
        await axios.get('http://localhost:3000/users')
        .then((res) => setUser(res.data))
    }

    useEffect(()=>{
        loadUser();
    })
    const handleBlock = async (id) => {
        const res = await axios.get(`http://localhost:4000/users/${id}`)
        const user = res.data;
        const updatedUser = { ...user, action: false }
        await axios.put(`http://localhost:4000/users/${id}`, updatedUser)
        loadUser();
    }

    const handleActive = async (id) => {
        const res = await axios.get(`http://localhost:4000/users/${id}`)
        const user = res.data;
        const updatedUser = { ...user, action: true }
        await axios.put(`http://localhost:4000/users/${id}`, updatedUser)
        loadUser();
    }
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
                                    <td>{u.wishlist.length}</td>
                                    <td>{u.cart.length}</td>
                                    <td>{u.orders.length}</td>
                                    <td>
                                        {u.action ? (
                                            <span className="active-status">Active</span>
                                        ) : (
                                            <span className="blocked-status">Blocked</span>
                                        )}
                                    </td>
                                    <td>
                                        <button className="block-btn" onClick={() => handleBlock(u.id)}>Block</button>
                                        <button className="active-btn" onClick={() => handleActive(u.id)}>Active</button>
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