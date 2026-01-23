import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Layout from "../pages/Layout";
import Login from "../pages/Login";
import SellerLogin from "../pages/Sellerlogin";
import CartModal from "../components/buyer/Cartmodel";
import AccountPage from "../components/buyer/Account";
import Wishlist from "../components/buyer/wishlist";
import Products from "../pages/Products";
import Product from "../components/common/Product";
import CategoryProducts from "../components/common/CategoryProducts";
import Signup from "../pages/Signup";
import LoginSuccess from "../components/common/LoginSuccess";
import SellerSignup from "../pages/SellerSignup";
import Order from "../components/buyer/Order";
import SellerDashboard from "../pages/SellerDashboard";
import DboyDashboard from "../pages/DboyDashboard";

const Page = () => {
  const PrivateRoute = ({ children }) => {
    const islogin = localStorage.getItem('id')
    const role = localStorage.getItem('role')
    return islogin ? children : role=='buyer' ? <Navigate to='/' /> : <Navigate to='/login'/>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/sellersignup" element={<SellerSignup/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/login-success" element={<LoginSuccess/>}/>
        <Route path='/sellerlogin' element={<SellerLogin />} />
        <Route path="/buyer/cart" element={<CartModal/>} />
        <Route path="/buyer/wishlist" element={<PrivateRoute><Wishlist/></PrivateRoute>}/>
        <Route path="/buyer" element={<PrivateRoute><AccountPage/></PrivateRoute>}/>
        <Route path="/createorder" element={<PrivateRoute><Order/></PrivateRoute>}/>
        <Route path="/" element={<Layout />} >
          <Route path="" element={<Home />} />
          <Route path="products" element={<Products/>}/>
          <Route path="product/:id" element={<Product/>}/>
          <Route path="category/:pcid/:scid" element={<CategoryProducts/>}/>
        </Route>
        <Route path="/sdashboard" element={<PrivateRoute><SellerDashboard/></PrivateRoute>}/>
        <Route path="/dbdeshboard" element={<PrivateRoute><DboyDashboard/></PrivateRoute>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default Page;
