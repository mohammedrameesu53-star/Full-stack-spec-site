import React from 'react'
import ProductList from '../components/ProductList'
import './Home.css'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../components/UserContext'
const Home = () => {
  const navigate = useNavigate()

  const { user } = useUser()
  return (
    <>
    {/* Hero Section */}
    <section className='hero'>
       <div className="hero-content">
        <img className='banner' src="https://www.specsmakers.in/cdn/shop/files/warli_banner_01Artboard_3_f4d801a9-9f80-49c6-84bd-7f5ff5427048.jpg?v=1757426467&width=1920" alt="advertisment" onClick={()=> navigate("/productlist")} />
        <h1>Welcome { user ? user.username : "to Myshop" } </h1>
        <p>Your one-stop destination for the best products</p>
        <button className="hero-btn" onClick={()=> navigate("/productlist")}>Shop Now</button>
       </div>
    </section>

    {/* Product List */}
    <ProductList/>

    <footer className='footer'>
      <p>© 2025 MyShop. All Rights Reserved.</p>
    </footer>
    </>
    
  )
}

export default Home