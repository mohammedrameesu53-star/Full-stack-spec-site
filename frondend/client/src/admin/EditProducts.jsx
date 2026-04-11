import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Swal from 'sweetalert2'
import './EditProducts.css'

export default function EditProducts() {
    const [product, setProduct] = useState({})
    const navigate = useNavigate()
    const { id } = useParams()

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/products/${id}/`)
            .then((res) => setProduct(res.data))
    }, [])

    const handleSave = async () => {
        await axios.put(`http://127.0.0.1:8000/api/products/${id}/`, product)

        Swal.fire({
            title: "Do you want to save the changes?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Save",
            denyButtonText: `Don't save`
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire("Saved!", "", "success")
                navigate("/admin/products")
            } else if (result.isDenied) {
                Swal.fire("Changes are not saved", "", "info");
            }
        });

    }
    return (
        <div className="edit-container">

            <div className="edit-card">


                <div className="image-section">
                    <img src={product.image} alt={product.name} />
                </div>

                <div className="form-section">
                    <h2>Edit Product</h2>

                    <label>Name</label>
                    <input
                        type="text"
                        value={product.name}
                        onChange={(e) => setProduct({ ...product, name: e.target.value })}
                    />

                    <label>Type</label>
                    <input
                        type="text"
                        value={product.type}
                        onChange={(e) => setProduct({ ...product, type: e.target.value })}
                    />

                    <label>Price</label>
                    <input
                        type="number"
                        value={product.price}
                        onChange={(e) => setProduct({ ...product, price: e.target.value })}
                    />

                    <label>Image URL</label>
                    <input
                        type="text"
                        value={product.image}
                        onChange={(e) => setProduct({ ...product, image: e.target.value })}
                    />

                    <button onClick={handleSave} className="save-btn" >Save Changes</button>

                </div>
            </div>
        </div>




    )
}