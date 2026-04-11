import axios from "axios";
import { useState } from "react";
import "./AddProducts.css";
import api from "../api/api";

export default function AddProducts() {
    const [product, setProduct] = useState({
        name: "",
        type: "",
        price: "",
        image: ""
    });

    const handleAdd = async () => {
        const res = await api.get("http://localhost:3000/products");
        const id = res.data.length + 1;

        const newProduct = { id, ...product };
        await axios.post("http://localhost:3000/products", newProduct);

        alert("Product Added Successfully!");

        setProduct({ name: "", type: "", price: "", image: "" });
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
                        <label>Type</label>
                        <input 
                            type="text" 
                            value={product.type}
                            onChange={(e) => setProduct({ ...product, type: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Price</label>
                        <input 
                            type="text" 
                            value={product.price}
                            onChange={(e) => setProduct({ ...product, price: e.target.value })}
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

                    <button className="add-btn" onClick={handleAdd}>Add Product</button>
                </div>

            </div>
        </div>
    );
}
