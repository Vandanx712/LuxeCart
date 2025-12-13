import { useState, useRef, useEffect } from "react";
import { FiBell, FiGrid, FiHeart, FiHome, FiLogIn, FiMenu, FiPackage, FiSearch, FiUser, FiX } from "react-icons/fi";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux'
import CategoryDropdown from "./CategoryDropdown";

const Navbar = () => {
  const cartItems = useSelector(state => state.cart.items)
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isAccount, SetIsAccount] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryOpen,setCategoryOpen] = useState(false)
  const [cart, setCart] = useState(cartItems.length)
  const [profilepic, setProfilepic] = useState(JSON.parse(localStorage.getItem("profilepic")))
  const navigate = useNavigate()

  const cartRef = useRef(null);
  const accountRef = useRef(null);

  useEffect(() => {

    const expirytime = localStorage.getItem('expirytime')
    if(new Date().getDate() > Number(expirytime)){
      SetIsAccount(false)
      Logout()
    }else{
      SetIsAccount(true)
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const Logout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/logout`, {}, { withCredentials: true })
      localStorage.clear()
    } catch (error) {
      console.log(error)
    }
  }

  async function loadCart() {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/buyer/cartproducts`, { withCredentials: true })
      setCart(response.data.cartProducts.items.length ?? 0)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    loadCart()
  }, [cartItems.length])

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 font-Monrope transition-all duration-300 ${isScrolled
        ? 'bg-white/9 backdrop-blur-md shadow-lg border-b-0 border-gray-300'
        : 'bg-white'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between md:h-21 h-19 items-center">
            <button className="sm:hidden p-2 hover:bg-gold/10 rounded-md transition-colors" onClick={()=>setIsMobileMenuOpen(true)}>
              <FiMenu className="h-6 w-6 text-DeepNavy hover:text-gold" />
            </button>
            {/* Logo */}
            <div className="flex items-start">
              <h1 className="text-2xl lg:text-3xl font-Playfair font-bold bg-gradient-to-r from-[#1E3A5F] via-[#5E3A9A] to-[#D4AF37] bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
                LuxeCart
              </h1>
            </div>

            {/* Desktop Search & Menu */}
            <div className="hidden md:flex items-center space-x-9 text-xl">
              <Link to="/" className="font-Playfair text-DeepNavy hover:text-gold transition-colors duration-300">
                Home
              </Link>
              <Link to="/products" className="font-Playfair text-DeepNavy hover:text-gold transition-colors duration-300">
                Products
              </Link>
              <button to="/categories" className="font-Playfair text-DeepNavy hover:text-gold transition-colors duration-300" onClick={()=>setCategoryOpen(!isCategoryOpen)}>
                Categories
              </button>
            </div>

            {/* Icons */}
            <div className="flex items-center md:space-x-7 space-x-5">   
              <div className="relative">
                <button className="flex items-center text-[#1E3A5F] hover:text-[#D4AF37] transition-all duration-300 hover:scale-105 transform group">
                  <FiSearch size={25} />
                </button>
              </div>

              {/* Cart */}
              <div className="relative  sm:block hidden" ref={cartRef}>
                <button onClick={() =>navigate('/buyer/cart')} className="flex items-center text-[#1E3A5F] hover:text-[#D4AF37] transition-all duration-300 hover:scale-105 transform group">
                  <HiOutlineShoppingCart size={25} />
                  <span className="absolute -top-1 -right-2 bg-[#D4AF37] text-[#F8F8F8]  w-4 h-4 text-xs rounded-full px-1">{cart}</span>
                </button>
              </div>

              {isAccount && (
                <div className="relative lg:block hidden">
                  <button className="flex items-center text-[#1E3A5F] hover:text-[#D4AF37] transition-colors duration-300 hover:scale-105 transform group">
                    <FiBell size={25} />
                    <span className="absolute -top-1 -right-2 bg-[#D4AF37] text-[#F8F8F8]  w-4 h-4 text-xs rounded-full px-1">6</span>
                  </button>
                </div>
              )}

              {/* Account */}
              {isAccount ? (<div className="relative sm:block hidden" ref={accountRef}>
                <button onClick={() => setIsAccountOpen(!isAccountOpen)} className="flex items-center text-[#1E3A5F] hover:text-[#D4AF37] transition-all duration-300 hover:scale-105 transform grou">
                  {profilepic && (<img
                    src={profilepic.url}
                    className="w-9 h-9 rounded-full object-cover"
                  />)}
                  <FiUser size={25} className={profilepic ? 'hidden' : 'block'}/>
                </button>

                {isAccountOpen && navigate('/buyer')}
              </div>) : (
                <div className="relative">
                  <button className="flex items-center text-[#1E3A5F] hover:text-[#D4AF37] transition-colors duration-300 hover:scale-105 transform group" onClick={() => { navigate('/login') }}>
                    <FiLogIn size={25} />
                    <span className=" text-[20px]">Login</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-white z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white overflow-y-auto z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-warmgrey/20">
          <h2 className="font-Playfair text-[22px] text-DeepNavy">Menu</h2>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 hover:bg-gold/10 rounded-md transition-colors"
          >
            <FiX className="h-6 w-6 text-DeepNavy" />
          </button>
        </div>

        {/* Mobile Menu Items */}
        <nav className="flex flex-col p-4 space-y-2 text-xl">
          <Link
            to='/'
            onClick={()=>setIsMobileMenuOpen(false)}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gold/10 transition-colors duration-300"
          >
            <FiHome className="h-6 w-6 text-DeepNavy" />
            <span className="font-Manrope text-DeepNavy font-medium">Home</span>
          </Link>

          <Link
            to='/products'
            onClick={()=>setIsMobileMenuOpen(false)}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gold/10 transition-colors duration-300"
          >
            <FiPackage className="h-6 w-6 text-DeepNavy" />
            <span className="font-Manrope text-DeepNavy font-medium">Products</span>
          </Link>

          <button
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gold/10 transition-colors duration-300" onClick={()=>{setCategoryOpen(!isCategoryOpen);setIsMobileMenuOpen(false)}}
          >
            <FiGrid className="h-6 w-6 text-deep-navy" />
            <span className="font-Manrope text-DeepNavy font-medium">Categories</span>
          </button>

          <Link
            to='/buyer/cart'
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gold/10 transition-colors duration-300"
          >
            <HiOutlineShoppingCart className="h-6 w-6 text-deep-navy" />
            <span className="font-Manrope text-DeepNavy font-medium">Cart</span>
          </Link>
          <Link
            to='/buyer'
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gold/10 transition-colors duration-300"
          >
            <FiUser className="h-6 w-6 text-DeepNavy" />
            <span className="font-Manrope text-DeepNavy font-medium">Account</span>
          </Link>
        </nav>

        {/* Mobile Menu Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-warmgrey/20">
            <div className="text-center">
              <p className="font-sans text-[17px] text-gray-500">
                Welcome to LuxeCart
              </p>
            </div>
        </div>
      </div>
      {isCategoryOpen && <CategoryDropdown onclose={()=>setCategoryOpen(!isCategoryOpen)}/>}
    </>
  );
};

export default Navbar;
