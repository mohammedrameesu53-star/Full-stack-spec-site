import Cart from "./pages/Cart"
import Home from "./pages/Home"
import Login from "./components/Login"
import ProductList from "./components/ProductList"
import Register from "./components/Register"
import { Routes, Route } from "react-router-dom"
import Wishlist from "./pages/Wishlist"
import Orders from "./pages/Orders"
import Navbar from "./components/Navbar"
import AdminPrivateRoute from "./admin/AdminPrivateRoute"
import AdminLogin from "./admin/AdminLogin"
import AdminDashboard from "./admin/AdminDashboard"
import AdminProducts from "./admin/AdminProducts"
import AdminOrders from "./admin/AdminOrders"
import EditProducts from "./admin/EditProducts"
import UserManagement from "./admin/UserManagement.jsx"
import AddProducts from "./admin/AddProducts"
import ProductDetails from "./components/ProductDetails.jsx";
import VerifyOTP from "./components/VerifyOTP.jsx"
import ForgotPassword from "./components/ForgotPassword.jsx"
import NewPassword from "./components/NewPassword.jsx"
import PasswordResetVerifyOTP from "./components/PasswordResetVerifyOTP.jsx"


function App() {

  return (
    <>
      <Routes>

        <Route
          path="/*"
          element={
            <>

              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/productlist" element={<ProductList />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/verify-otp" element={<VerifyOTP />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-otp/reset" element={<PasswordResetVerifyOTP />} />
                <Route path="/new-password" element={<NewPassword/>} />

              </Routes>

            </>
          }
        />

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin/dashboard"
          element={
            <AdminPrivateRoute>
              <AdminDashboard />
            </AdminPrivateRoute>
          } />

        <Route
          path="/admin/UserManagement"
          element={
            <AdminPrivateRoute>
              <UserManagement />
            </AdminPrivateRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <AdminPrivateRoute>
              <AdminProducts />
            </AdminPrivateRoute>
          } />

        <Route
          path="/admin/products/edit/:id"
          element={
            <AdminPrivateRoute>
              <EditProducts />
            </AdminPrivateRoute>
          }
        />

        <Route
          path="/admin/AddProducts"
          element={
            <AdminPrivateRoute>
              <AddProducts />
            </AdminPrivateRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <AdminPrivateRoute>
              <AdminOrders />
            </AdminPrivateRoute>
          } />

      </Routes>




    </>
  )
}

export default App
