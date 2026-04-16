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

      setCart(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, quantity: newQty }
            : item
        )
      );

    } catch (err) {
      console.log(err);
    }
  };

  const handleRemove = async (id) => {
    try {
      await api.delete(`cart/${id}/`);
      loadCart()
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
    try {
      const res = await api.post("order/create/");

      const options = {
        key: res.data.key,
        amount: res.data.amount,
        currency: res.data.currency,
        order_id: res.data.order_id,
        name: "MyShop",

        handler: async function (response) {
          await api.post("payment/success/", {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature
          });

          loadCart();
          fetchCart();

          Swal.fire({
            title: "Payment Successful!",
            icon: "success"
          });
        }
      }

      
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.response?.data?.error || "Something went wrong",
        icon: "error"
      });
    }
  }
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
                  disabled={p.quantity === 1}
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
