import { Children } from "react"
import { Navigate } from "react-router-dom"

export default function AdminPrivateRoute({children }){
    const admin =JSON.parse(localStorage.getItem("admin"))

    if(!admin){
        return <Navigate to='/admin/login' />
    }

    return children;
}