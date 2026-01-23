import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useState,useEffect } from 'react';
import { FiArrowLeft, FiShoppingBag, FiX } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux'
import { setcartitems } from '../../redux/cartslice'
import {setorderitems,settotalprice} from '../../redux/order'
import { useNavigate } from 'react-router-dom';

const CartModal = () => {
    const cartItems = useSelector(state => state.cart.items)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [totalprice, setTotalprice] = useState(0)
    const [cart, setCart] = useState(cartItems)

    const shippingNote = "Shipping and taxes calculated at checkout.";
    useEffect(()=>{
        loadCart()
    },[])
    
    async function loadCart() {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/buyer/cartproducts`, { withCredentials: true })
            const total = response.data.cartProducts.totalprice;
            const items = response.data.cartProducts?.items;
            const cartitems = items.map((item) => {
                const pid = item.product;
                const vid = item.variant;
                const name = item.productDetails.name;
                const qty = item.quantity;
                const variant_name = item.variantDetails.variant_name;
                const price = item.variantDetails.price;
                const discount_price = item.variantDetails.discount_price;
                const img = item.productDetails.images?.[0] ?? '';

                return {
                    pid,
                    vid,
                    name,
                    qty,
                    variant_name,
                    price,
                    discount_price,
                    img,
                };
            });
            setCart(cartitems)
            setTotalprice(total);
        } catch (error) {
            console.log(error)
        }
    }

    async function removeItem(pid, vid) {
        try {
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/buyer/removeoncart/${pid}/${vid}`, {}, { withCredentials: true })
            setTotalprice(response.data.cart.totalprice)
            setCart(cart.filter((item) => (item.pid !== pid && item.vid !== vid) || (item.pid === pid && item.vid !== vid)))
            dispatch(setcartitems(cart))
            toast.success(response.data.message)
        } catch (error) {
            console.log(error)
        }
    }
    async function increaseQty(pid, vid) {
        try {
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/buyer/addoncart`, {
                productId: pid,
                variantId: vid,
                quantity: 1
            }, { withCredentials: true })
            setTotalprice(response.data.cart.totalprice)
            setCart(prevItems =>
                prevItems.map(item =>
                    item.pid === pid && item.vid === vid ? { ...item, qty: item.qty+1 } : item
                )
            )
        } catch (error) {
            console.log(error)
        }
    }
    async function decreaseQty(pid, vid, qty) {
        if(qty===1) removeItem(pid,vid)
        try {
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/buyer/addoncart`, {
                productId: pid,
                variantId: vid,
                quantity: -1
            }, { withCredentials: true })
            setTotalprice(response.data.cart.totalprice)
            setCart(prevItems =>
                prevItems.map(item =>
                    item.pid === pid && item.vid === vid ? { ...item, qty: item.qty - 1 } : item
                )
            )
        } catch (error) {
            console.log(error)
        }
    }

    const checkout =()=>{
        dispatch(setorderitems(cart))
        dispatch(settotalprice(totalprice))
        navigate('/createorder')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-offwhite to-white">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-warmgrey/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-18">
                        <button
                            onClick={()=>window.history.back()}
                            className="flex items-center space-x-2 text-warmgrey hover:text-CharcoalBlack transition-colors group"
                        >
                            <FiArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-manrope hidden sm:block">Continue Shopping</span>
                        </button>

                        <h1 className="text-[25px] font-Playfair font-medium text-CharcoalBlack">
                            Shopping Cart
                        </h1>

                        <div className="flex items-center space-x-2 text-warmgrey">
                            <FiShoppingBag className={`h-5 w-5 ${cart.length > 0 ? 'animate-bounce' : ''}`}/>
                            <span className="font-manrope text-sm">
                                {cart.length } 
                            </span>
                            <span className=' hidden sm:block'>{cart.length === 1 ? 'item' : 'items'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {cart.length === 0 ? (
                    /* Empty Cart State */
                    <div className="flex flex-col items-center justify-center py-16 lg:py-24">
                        <div className="relative mb-8">
                            <div className="h-32 w-32 rounded-full bg-gradient-to-br from-offwhite to-warmgrey/10 flex items-center justify-center shadow-lg">
                                <FiShoppingBag className="h-16 w-16 text-warmgrey" />
                            </div>
                            <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-royalpurple flex items-center justify-center">
                                <span className="text-white text-sm font-medium">0</span>
                            </div>
                        </div>

                        <h2 className="text-3xl font-Playfair font-medium text-CharcoalBlack mb-4">
                            Your cart is empty
                        </h2>
                        <p className="text-warmgrey text-center font-manrope text-lg mb-8 max-w-md">
                            Discover amazing products and add them to your cart to get started on your shopping journey!
                        </p>

                        <button
                            onClick={()=>navigate('/products')}
                            className="px-8 py-4 rounded-xl bg-royalpurple hover:bg-royalpurple/90 text-white font-Monrope text-lg transition-all duration-200 hover:shadow-lg hover:scale-105"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-sm border border-warmgrey/10 overflow-hidden">
                                <div className="p-6 border-b border-warmgrey/10">
                                    <h2 className="text-xl font-Playfair font-medium text-CharcoalBlack">
                                        Your Items
                                    </h2>
                                </div>

                                <div className="divide-y divide-warmgrey/10">
                                    {cart.map((item, index) => (
                                        <div key={item.pid} className="p-6 hover:bg-offwhite/30 transition-colors">
                                            <div className="flex flex-col sm:flex-row gap-4">
                                                {/* Product Image */}
                                                <div className="relative group">
                                                    <div className="h-24 w-24 sm:h-28 sm:w-28 flex-shrink-0 overflow-hidden rounded-xl border border-warmgrey/20 bg-offwhite shadow-sm">
                                                        <img
                                                            src={item.img.url}
                                                            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex-1 space-y-3">
                                                    <div>
                                                        <h3 className="text-lg font-sans text-CharcoalBlack leading-tight mb-1">
                                                            {item.name}
                                                        </h3>
                                                        <p className="text-sm text-warmgrey font-Manrope">
                                                            {item.variant_name}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                        <div className="flex items-center space-x-4">
                                                            <span className="text-sm text-warmgrey font-Manrope">Quantity</span>
                                                            <div className="flex items-center space-x-2 bg-offwhite rounded-lg p-1">
                                                                <button
                                                                    onClick={() => decreaseQty(item.pid, item.vid,item.qty)}
                                                                    className="h-8 w-8 rounded-md text-CharcoalBlack hover:text-royalpurple text-sm font-semibold hover:bg-white transition-all duration-150 flex items-center justify-center"
                                                                >
                                                                    −
                                                                </button>
                                                                <span className="text-sm font-medium text-CharcoalBlack px-3 py-1 bg-white rounded-md min-w-[2rem] text-center">
                                                                    {item.qty}
                                                                </span>
                                                                <button
                                                                    onClick={() => increaseQty(item.pid,item.vid)}
                                                                    className="h-8 w-8 rounded-md text-CharcoalBlack hover:text-royalpurple text-sm font-semibold hover:bg-white transition-all duration-150 flex items-center justify-center"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <button
                                                            onClick={() => removeItem(item.pid, item.vid)}
                                                            className="text-sm text-royalpurple hover:text-royalpurple/80 font-sans transition-colors flex items-center space-x-1 hover:underline"
                                                        >
                                                            <FiX className="h-4 w-4" />
                                                            <span>Remove</span>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="text-right space-y-1 sm:ml-4">
                                                    <p className={`text-lg font-sans ${item.discount_price!== item.price ? 'line-through text-warmgrey' : 'hidden'}`}>
                                                        ₹{(item.price * item.qty).toFixed(2)}
                                                    </p>
                                                    {item.discount_price && (
                                                        <p className="text-lg text-CharcoalBlack font-Manrope font-medium">
                                                            ₹{(item.discount_price * item.qty).toFixed(2)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-1">
                            <div className="sticky top-24">
                                <div className="bg-white rounded-2xl shadow-sm border border-warmgrey/10 overflow-hidden">
                                    <div className="p-6 border-b border-warmgrey/10">
                                        <h2 className="text-xl font-Playfair font-medium text-CharcoalBlack">
                                            Order Summary
                                        </h2>
                                    </div>

                                    <div className="p-6 space-y-6">
                                        <div className="flex items-center justify-between py-2">
                                            <span className="text-lg font-Playfair font-medium text-CharcoalBlack">
                                                Subtotal
                                            </span>
                                            <span className="text-xl font-sans text-CharcoalBlack font-medium">
                                                ₹{totalprice}
                                            </span>
                                        </div>
                                        <div className="bg-offwhite/50 rounded-lg p-4">
                                            <p className="text-sm text-warmgrey font-Manrope text-center">
                                                {shippingNote}
                                            </p>
                                        </div>
                                        <button className="w-full bg-royalpurple hover:bg-royalpurple/90 text-white font-Manrope py-4 text-lg rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]" onClick={checkout}>
                                            Proceed to Checkout
                                        </button>
                                        <button
                                            onClick={()=>window.history.back()}
                                            className="w-full border-2 border-warmgrey/30 hover:border-royalpurple text-CharcoalBlack hover:text-royalpurple font-Manrope py-3 text-base rounded-xl transition-all duration-200 hover:bg-royalpurple/5"
                                        >
                                            Continue Shopping
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Toaster position="top-center" reverseOrder={false} />
        </div>
    );
};

export default CartModal;