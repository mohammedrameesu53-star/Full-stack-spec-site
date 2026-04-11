import { useState } from "react";
import './Cart.css'
import { useUser } from "../components/UserContext";
import Swal from "sweetalert2";
import api from "../api/api";
import { useEffect } from "react";

export default function Cart() {
  const { fetchCart } = useUser();

  const [cart, setCart] = useState([]);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const res = await api.get("cart/");
      setCart(res.data);
    } catch (err) {
      console.log(err);
    }
   
  };

  const updateQty = async (id, change) => {
    const item = cart.find(p => p.id === id);
    
    const newQty = Math.max(1, item.quantity + change);

    try {
      await api.patch(`cart/${id}/`, {
        quantity: newQty
      });

      loadCart(); // refresh
      
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemove = async (id) => {
    try {
      await api.delete(`cart/${id}/`);
      loadCart();
      fetchCart();
    } catch (err) {
      console.log(err);
    }
  };
  const total = cart.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );
  const handleBuy = async () => {
    Swal.fire({
      title: "Order feature coming soon!",
      icon: "info"
    });
  };

return (
  <div className="cart-wrapper">
    <div className="cart-container">
      {cart.length === 0 ? (
        <h2>Your cart is empty</h2>
      ) : (
        cart.map((p) => (
          <div key={p.id} className="cart-card">
            <img src={p.product.image} alt={p.product.name} className="cart-img" />

            <h3 className="cart-title">{p.product.name}</h3>
            <p className="cart-price">₹{p.product.price}</p>

            {/* Quantity Buttons */}
            <div className="qty-box">
              <button
                onClick={() => updateQty(p.id, -1)}
                className="qty-btn"
              // disabled={p.quantity === 1}
              >
                -
              </button>

              <span className="qty-count">{p.quantity}</span>

              <button
                onClick={() => updateQty(p.id, 1)}
                className="qty-btn"
              >
                +
              </button>
            </div>

            <button
              onClick={() => handleRemove(p.id)}
              className="remove-btn"
            >
              Remove
            </button>
          </div>
        ))
      )}
    </div>

    {/* RIGHT SUMMARY */}
    <div className="cart-summary">
      <h2>Order Summary</h2>
      <hr />
      <p>Total Items: <b>{cart.length}</b></p>
      <p>Total Price: <b>₹{total}</b></p>

      <button
        className="buy-btn"
        disabled={cart.length === 0}
        onClick={handleBuy}
      >
        Buy now
      </button>
    </div>
  </div>
);
};
