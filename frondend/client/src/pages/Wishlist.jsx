import { Link } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import './WishList.css'
import { useUser } from '../components/UserContext'
import api from '../api/api'

const Wishlist = () => {

  const [wishList, setWishList] = useState([])

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await api.get("wishlist/");
      setWishList(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const handleRemove = async (id) => {
    try {
      await api.delete(`wishlist/${id}/`);

      setWishList(prev => prev.filter(item => item.id !== id));

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="wishlist-container">
      <h2 className='wishlist-title'>❤️ Your Wishlist</h2>

      {wishList.length === 0 ? (
        <p className='empty-wishlist'>
          Your wishList is empty.<Link to='/productlist'>Click here for products</Link>
        </p>
      ) : (
        <div className="wishlist-grid">
          {wishList.map((item) => (
            <div key={item.id} className="wishlist-card" >
              <div className="wish-img-box">
                <img src={item.product.image} alt={item.product.name} className="wish-img" />
              </div>

              <div className='wishlist-info'>
                <h3 className="product-name">{item.product.name}</h3>
                <p className="product-price">₹{item.product.price}</p>
                <button className='remove-btn' onClick={() => handleRemove(item.id)}> Remove</button>
              </div>



            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default Wishlist