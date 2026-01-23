import axios from 'axios'
import { useEffect, useState } from 'react'
import { FiArrowLeft, FiHeart, FiShoppingCart, FiX } from 'react-icons/fi'
import { useSelector, useDispatch } from 'react-redux'
import { toast, Toaster } from 'react-hot-toast'

function Wishlist() {
    const wishlistitems = useSelector(state => state.list.items)
    const dispatch = useDispatch()
    const [wishlist, setWishlist] = useState(wishlistitems)
    const [listId,setListId] = useState(0)

    useEffect(() => {
        loadlist()
    }, [])

    async function loadlist() {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/buyer/listproducts`, { withCredentials: true })
            const products = response.data.wishlistProducts.products

            const wishlistItems = products.map((item) => {
                const pid = item._id
                const name = item.name
                const price = item.price
                const discount_price = item.discount_price
                const img = item.images?.[0]?.url

                return {
                    pid,
                    name,
                    price,
                    discount_price,
                    img
                }
            })
            setListId(response.data.wishlistProducts._id)
            setWishlist(wishlistItems)
        } catch (error) {
            console.log(error)
        }
    }

    async function removeFromList(pid) {
        try {
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/buyer/removeonwishlist/${pid}/${listId}`,{},{withCredentials:true})
            setWishlist(wishlist.filter((item)=>item.pid !== pid))
            toast.success(response.data.message)
        } catch (error) {
            console.log(error)
        }
    }

    async function addToCart(item) {
        try {
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/buyer/addoncart`,{
                productId:item.pid,
                variantId:null,
                quantity:1
            },{withCredentials:true})
            toast.success(response.data.message)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
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

                            <h1 className="text-2xl font-Playfair font-medium text-CharcoalBlack">
                                My Favorites
                            </h1>

                            <div className="flex items-center space-x-2 text-warmgrey">
                                <FiHeart className="h-5 w-5" />
                                <span className="font-manrope text-sm">
                                    {wishlist.length}
                                </span>
                                <span className='font-manrope hidden sm:block'>{wishlist.length === 1 ? 'item' : 'items'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {wishlist.length === 0 ? (
                        /* Empty Favorites State */
                        <div className="flex flex-col items-center justify-center py-16 lg:py-24">
                            <div className="relative mb-8">
                                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-offwhite to-warmgrey/10 flex items-center justify-center shadow-lg">
                                    <FiHeart className="h-16 w-16 text-warmgrey" />
                                </div>
                                <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-royalpurple flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">0</span>
                                </div>
                            </div>

                            <h2 className="text-3xl font-Playfair font-medium text-CharcoalBlack mb-4">
                                Your favorites are empty
                            </h2>
                            <p className="text-warmgrey text-center font-manrope text-lg mb-8 max-w-md">
                                Save items you love by clicking the heart icon. They'll appear here for easy access later!
                            </p>

                            <button
                                onClick={() => window.history.back}
                                className="px-8 py-4 rounded-xl bg-royalpurple hover:bg-royalpurple/90 text-white font-Monrope text-lg transition-all duration-200 hover:shadow-lg hover:scale-105"
                            >
                                Discover Products
                            </button>
                        </div>
                    ) : (
                        /* Favorites Grid */
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {wishlist.map((item, index) => (
                                <div key={item.pid} className="bg-white rounded-2xl shadow-sm border border-warmgrey/10 overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="relative group">
                                        <div className="aspect-square overflow-hidden bg-offwhite">
                                            <img
                                                src={item.img}
                                                className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
                                            />
                                        </div>

                                        {/* Favorite Heart Indicator */}
                                        <div className="absolute top-3 left-3 h-10 w-10 bg-royalpurple rounded-full flex items-center justify-center shadow-sm">
                                            <FiHeart className="h-4 w-4 text-white fill-current animate-pulse" />
                                        </div>
                                    </div>

                                    {/* Product Details */}
                                    <div className="p-6 space-y-4">
                                        <div>
                                            <h3 className=" h-15 text-lg font-sans text-CharcoalBlack leading-tight">
                                                {item.name}
                                            </h3>
                                        </div>

                                        {/* Price */}
                                        <div className="space-y-1">
                                            <p className={`text-lg font-sans ${item.discount_price ? 'line-through text-warmgrey' : 'text-CharcoalBlack font-medium'}`}>
                                                ₹{item.price.toFixed(2)}
                                            </p>
                                            {item.discount_price && (
                                                <p className="text-lg text-CharcoalBlack font-Manrope font-medium">
                                                    ₹{item.discount_price.toFixed(2)}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <button
                                                onClick={() => addToCart(item)}
                                                className="w-full bg-royalpurple hover:bg-royalpurple/90 text-white font-Manrope py-3 text-base rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
                                            >
                                                <FiShoppingCart className="h-4 w-4" />
                                                <span>Add to Cart</span>
                                            </button>
                                            <button
                                                onClick={() => removeFromList(item.pid)}
                                                className="w-full border-2 border-warmgrey/30 hover:border-royalpurple text-CharcoalBlack hover:text-royalpurple font-Manrope py-3 text-base rounded-xl transition-all duration-200 hover:bg-royalpurple/5 flex items-center justify-center space-x-2"
                                            >
                                                <FiHeart className="h-4 w-4" />
                                                <span>Remove from Favorites</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <Toaster position="top-center" reverseOrder={false} />
            </div>

        </>
    )
}

export default Wishlist
