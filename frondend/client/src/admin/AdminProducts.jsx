import { useEffect, useState } from "react";
import AdminSideBar from "./AdminSidebar";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import './AdminProducts.css'
import api from "../api/adminApi";
import Swal from "sweetalert2";

export default function AdminProducts() {
    const [products, setProducts] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        loadProducts();
    }, [])

    const loadProducts = async () => {
        try {
            const res = await api.get('products/')
            setProducts(res.data)
        } catch (err) {
            console.log(err)
        }
    };

    const handleDelete = async (id) => {
        try {

            await api.delete(`products/${id}/`)

        } catch (err) {
            console.log(err)
        }

        Swal.fire({
            title: "Product deleted!",
            icon: "success"
        });
        loadProducts();
    }


    return (
        <div className="admin-products-page">
            <AdminSideBar />

            <div className="product-content">
                <h1 className="page-title">Manage Products</h1>
                <button className="add-product-btn" onClick={() => navigate('/admin/AddProducts')}>
                    + Add Product
                </button>
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
                            {products?.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{p.name}</td>
                                    <td>{p.price}</td>
                                    <td><img src={p.image} alt={p.name} className="product-img" /></td>
                                    <td>
                                        <button className="edit-btn" onClick={() => navigate(`/admin/products/edit/${p.id}`)}>Edit</button> &nbsp;
                                        <button className="delete-btn" onClick={() => handleDelete(p.id)}>Delete</button>
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