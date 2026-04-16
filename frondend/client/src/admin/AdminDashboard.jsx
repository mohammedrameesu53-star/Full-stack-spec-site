import AdminSideBar from "./AdminSidebar";
import './AdminDashboard.css'
import { useState , useEffect } from "react";
import axios from "axios";
import api from "../api/adminApi";

export default function AdminDashboard(){
    const [productCount,setProductCount] = useState(0)
    const [orderCount,setOrderCount] = useState(0)
    const [userCount,setUserCount] = useState(0)
    const [data,setData] = useState()

    useEffect(()=>{
        const fetchCounts = async()=>{
            try{
                const res = await api.get('dashboard/')
                setData(res.data)
                setProductCount(res.data.products)
                setOrderCount(res.data.orders)
                setUserCount(res.data.users)
            } catch(err){
                console.log(err);
            }
        }

        fetchCounts(); 
    },[]);

    return(
        <div className="dashboard-container">
            <AdminSideBar/>

            <div className="dashboard-content">
                <h1>Admin Dashboard</h1>

                <div className="stats-container">

                        
                    <div className="stat-card">
                        <h3>Total Products</h3>
                        <p>{productCount}</p>
                    </div>


                    <div className="stat-card">
                        <h3>Total Orders</h3>
                        <p>{orderCount}</p>
                    </div>


                    <div className="stat-card">
                        <h3>Users</h3>
                        <p>{userCount}</p>
                    </div>

                    
                </div>
            </div>
        </div>
    )
}