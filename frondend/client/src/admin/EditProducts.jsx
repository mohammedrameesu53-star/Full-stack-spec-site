import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import "./EditProducts.css";
import api from "../api/adminApi";

export default function EditProducts() {
    const [product, setProduct] = useState({});
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        loadProduct(id);
    }, [id]);

    const loadProduct = async (id) => {
        try {
            const res = await api.get(`product/${id}/`); 
            setProduct(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleSave = async () => {
        const result = await Swal.fire({
            title: "Do you want to save the changes?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Save",
            denyButtonText: "Don't save"
        });

        if (result.isConfirmed) {
            try {
                await api.patch(`product/${id}/`, product); 

                Swal.fire("Saved!", "", "success");
                navigate("/admin/products");

            } catch (err) {
                Swal.fire("Error", "Failed to update product", "error");
            }
        }
    };

    return (
        <div className="edit-container">
            <div className="edit-card">

   
                <div className="image-section">
                    <img src={product.image || ""} alt={product.name || ""} />
                </div>

                <div className="form-section">
                    <h2>Edit Product</h2>

              
                    <label>Name</label>
                    <input
                        type="text"
                        value={product.name || ""}
                        onChange={(e) =>
                            setProduct({ ...product, name: e.target.value })
                        }
                    />

            
                    <label>Category</label>
                    <input
                        type="text"
                        value={product.category || ""}
                        onChange={(e) =>
                            setProduct({ ...product, category: e.target.value })
                        }
                    />

             
                    <label>Price</label>
                    <input
                        type="number"
                        value={product.price || ""}
                        onChange={(e) =>
                            setProduct({ ...product, price: e.target.value })
                        }
                    />

                   
                    <label>Description</label>
                    <textarea
                        value={product.description || ""}
                        onChange={(e) =>
                            setProduct({ ...product, description: e.target.value })
                        }
                    />

              
                    <label>Quantity</label>
                    <input
                        type="number"
                        value={product.qty || ""}
                        onChange={(e) =>
                            setProduct({ ...product, qty: e.target.value })
                        }
                    />

                    <label>Image URL</label>
                    <input
                        type="text"
                        value={product.image || ""}
                        onChange={(e) =>
                            setProduct({ ...product, image: e.target.value })
                        }
                    />

          
                    <button onClick={handleSave} className="save-btn">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}