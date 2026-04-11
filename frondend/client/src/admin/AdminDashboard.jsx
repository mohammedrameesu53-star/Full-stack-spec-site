import AdminSideBar from "./AdminSidebar";
import './AdminDashboard.css'

export default function AdminDashboard(){
    return(
        <div className="dashboard-container">
            <AdminSideBar/>

            <div className="dashboard-content">
                <h1>Admin Dashboard</h1>

                <div className="stats-container">

                        
                    <div className="stat-card">
                        <h3>Total Products</h3>
                        <p>50</p>
                    </div>


                    <div className="stat-card">
                        <h3>Total Orders</h3>
                        <p>12</p>
                    </div>


                    <div className="stat-card">
                        <h3>Users</h3>
                        <p>30</p>
                    </div>

                    
                </div>
            </div>
        </div>
    )
}