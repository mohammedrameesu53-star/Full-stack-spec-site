import { useEffect, useState } from "react";
import AdminSideBar from "./AdminSidebar";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import './AdminProducts.css'

export default function AdminProducts() {
    const [products, setProducts] = useState([])
    const navigate = useNavigate()
   
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/products/")
            .then(res => setProducts(res.data))
    }, [products])


    const handleDelete = async(id)=>{
        await axios.delete(`http://127.0.0.1:8000/api/products/${id}`)

        // const updatedProducts = res.data.filter( p => p.id !== id)
        // await axios.patch("http://localhost:4000/products",updatedProducts)
        alert("Product deleted!");
    }

    const handleAdd =()=>{
        navigate('/admin/AddProducts')
    }

    return (
        <div className="admin-products-page">
            <AdminSideBar />

            <div  className="product-content">
                <h1 className="page-title">Manage Products</h1>
                <button className="add-product-btn" onClick={handleAdd}>+ Add Products</button>
                <div className="table-wrapper">
                    <table className="product-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Image</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map((p) => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>{p.name}</td>
                                <td>{p.price}</td>
                                <img src={p.image} alt={p.name} className="product-img" />
                                <td>
                                    <button className="edit-btn" onClick={()=> navigate(`/admin/products/edit/${p.id}`)}>Edit</button> &nbsp;
                                    <button className="delete-btn" onClick={()=> handleDelete(p.id)}>Delete</button>
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