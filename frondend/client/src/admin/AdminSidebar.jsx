import { Link } from "react-router-dom";
import './AdminSidebar.css'

export default function AdminSideBar() {
    return (
        <div className="admin-sidebar">

            <h2 className="sidebar-title">Admin Panel</h2>

            <ul className="sidebar-menu">
                <li><Link to="/admin/dashboard" >DashBoard</Link></li>
                <li><Link to="/admin/UserManagement">UserManagement</Link></li>
                <li><Link to="/admin/products">products</Link></li>
                <li><Link to="/admin/orders" >Orders</Link></li>


                <li 
                className="logout-btn"
                onClick={()=>{
                    localStorage.removeItem("admin")
                    window.location.href = "/admin/login";
                }}
                >Logout</li>
            </ul>
        </div>
    )
}