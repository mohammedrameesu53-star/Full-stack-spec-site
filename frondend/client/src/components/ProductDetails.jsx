import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import './ProductDetails.css';
import { useUser } from "./UserContext";
import Swal from "sweetalert2";
import api from "../api/api";

export default function ProductDetails() {

    const { id } = useParams();        // get product ID from URL
    const [product, setProduct] = useState(null);
    const { user, updateUser } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        api.get(`products/${id}/`)
            .then(res => setProduct(res.data));
    }, [id]);

    if (!product) return <h2>Loading...</h2>;

    const addToCart = async () => {
        if (!user) return navigate('/login');

        user.cart = user.cart || [];
        const exists = user.cart.find(p => p.id === product.id);

        if (exists) {
            return Swal.fire({
                title: "Already in cart!",
                icon: "error"
            });
        }

        const updatedUser = { ...user, cart: [...user.cart, product] };
        await api.put(`http://localhost:4000/users/${user.id}`, updatedUser);
        updateUser(updatedUser);

        Swal.fire({
            title: "Added to cart!",
            icon: "success"
        });
    };

    return (
        <div className="details-container">
            <div className="details-card">
                
                <div className="details-left">
                    <img src={product.image} alt={product.name} className="details-img" />
                </div>

                <div className="details-right">
                    <h2 className="details-name">{product.name}</h2>

                    <p className="details-type">{product.type}</p>

                    <h3 className="details-price">₹{product.price}</h3>

                    <button className="details-btn" onClick={addToCart}>
                        Add to Cart
                    </button>

                    <button className="details-back" onClick={() => navigate(-1)}>
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}
