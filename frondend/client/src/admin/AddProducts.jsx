import { useState } from "react";
import "./AddProducts.css";
import api from "../api/adminApi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function AddProducts() {
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        name: "",
        category: "",
        price: "",
        description: "",
        qty: "",
        image: ""
    });

    const handleAdd = async () => {
        try {
            await api.post("products/", product);

            Swal.fire({
                title: "Product Added Successfully!",
                icon: "success"
            });

            navigate("/admin/products");

        } catch (err) {
            Swal.fire({
                title: "Error",
                text: "Failed to add product",
                icon: "error"
            });
        }
    };

    return (
        <div className="add-container">

            <div className="add-card">

                <div className="add-image-box">
                    <img 
                        src="https://addlogo.imageonline.co/image.jpg" 
                        alt="Add Product" 
                        className="add-side-image"
                    />
                </div>

                <div className="add-form-box">
                    <h2 className="form-title">Add New Product</h2>

                    <div className="form-group">
                        <label>Name</label>
                        <input 
                            type="text" 
                            value={product.name}
                            onChange={(e) => setProduct({ ...product, name: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <input 
                            type="text" 
                            value={product.category}
                            onChange={(e) => setProduct({ ...product, category: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Price</label>
                        <input 
                            type="number" 
                            value={product.price}
                            onChange={(e) => setProduct({ ...product, price: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={product.description}
                            onChange={(e) => setProduct({ ...product, description: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Quantity</label>
                        <input 
                            type="number" 
                            value={product.qty}
                            onChange={(e) => setProduct({ ...product, qty: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Image URL</label>
                        <input 
                            type="text"
                            value={product.image}
                            onChange={(e) => setProduct({ ...product, image: e.target.value })}
                        />
                    </div>

                    <button className="add-btn" onClick={handleAdd}>
                        Create Product
                    </button>
                </div>

            </div>
        </div>
    );
}