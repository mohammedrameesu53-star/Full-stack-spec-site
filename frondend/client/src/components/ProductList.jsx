import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom"
import './ProductList.css'
import { useUser } from "./UserContext";
import Swal from "sweetalert2";
import api from "../api/api";
import { useLocation } from "react-router-dom";

export default function ProductList() {
    const [product, setProduct] = useState([]);
    const navigate = useNavigate()
    const { user, fetchCart } = useUser()
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const searchTerm = query.get("search");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let url = "products/";

                if (searchTerm) {
                    url += `?search=${searchTerm}`;
                }

                const res = await api.get(url);
                setProduct(res.data);

            } catch (err) {
                console.log(err);
            }
        };

        fetchProducts();
    }, [searchTerm]);
    
    const addToCart = async (item) => {
        if (!user) {
            navigate('/login');
            return;
        }

        const token = localStorage.getItem("access");

        try {
            await api.post(
                "cart/",
                {
                    product_id: item.id,
                    quantity: 1
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            fetchCart()

            Swal.fire({
                title: "Added to cart!",
                icon: "success"
            });

        } catch (err) {
            console.log(err.response?.data);

            Swal.fire({
                title: "Error adding to cart",
                icon: "error"
            });
        }
    };

    const addtoWishList = async (item) => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            // 👉 Get current wishlist
            const res = await api.get("wishlist/");
            const isExist = res.data.find(w => w.product.id === item.id);

            if (isExist) {
                Swal.fire({
                    title: "Already in wishlist",
                    icon: "info"
                });
                return;
            }

            // 👉 Add to wishlist
            await api.post("wishlist/", {
                product_id: item.id
            });

            Swal.fire({
                title: "Added to wishlist ❤️",
                icon: "success"
            });

        } catch (err) {
            console.log(err.response?.data);

            Swal.fire({
                title: "Error",
                icon: "error"
            });
        }
    };

    return (
        <>
            <div className="product-container">
                <h2 className="product-title">Latest products</h2>
                <div className="product-grid">
                    {product.map((p) => (
                        <div key={p.id} className="product-card">
                            <Heart onClick={() => addtoWishList(p)} className="product-heart" />
                            <div
                                className="product-img-box"
                                onClick={() => navigate(`/product/${p.id}`)}
                                style={{ cursor: "pointer" }}
                            >
                                <img src={p.image} alt={p.name} className="product-img" />
                            </div>


                            <div className="product-info">
                                <h3 className="product-name">{p.name}</h3>
                                <p className="product-price">₹{p.price}</p>

                                <button className="btn-cart" onClick={() => addToCart(p)}>
                                    Add to Cart
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            </div>

        </>
    );
}
