import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FiHeart, FiShoppingCart, FiTruck } from 'react-icons/fi'
import axios from 'axios'
import ProductCard from './ProductCard'
import { useDispatch } from "react-redux";
import { addtocart } from '../../redux/cartslice'

function Product() {
  const dispatch = useDispatch()
  const _id = useParams().id
  const [id, setid] = useState(_id)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [discount_price, setDiscountPrice] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [catId, setCatId] = useState('')
  const [category, setCategory] = useState('')
  const [attribute, setAttribute] = useState('')
  const [varietys, setVarietys] = useState([])
  const [brand, setBrand] = useState('')
  const [productImages, setProductImgs] = useState([])
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSeletedVariant] = useState('')
  const [instock, setinStock] = useState(false)
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([])


  useEffect(() => {
    window.scrollTo(0,0)
    loadProduct()
  }, [])

  const loadProduct = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product/getproductById/${id}`)
      const detail = response.data.product[0]
      setName(detail.name)
      setBrand(detail.brand)
      setDescription(detail.description)
      setDiscount(detail.discount)
      setPrice(detail.price)
      setDiscountPrice(detail.discount_price)
      setCatId(detail.category)
      setProductImgs(detail.images)
      setVarietys(detail.variants)

      setSeletedVariant(detail.variants[0]._id)
      detail.variants[0].stock_count > 0 ? setinStock(true) : setinStock(false)

      const category = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product/category/${detail.category}`)
      setCategory(category.data.category.name)

      const attributeKey = detail.variants[0].attributes.map((attr) => attr.key)
      setAttribute(attributeKey.join(','))

      loadRelatedProduct(detail.subcategory)
    } catch (error) {
      console.log(error)
    }
  }

  const loadRelatedProduct = async (subcat) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product/searchby/${subcat}`)
      setRelatedProducts(response.data.products.filter((product)=>product._id!==id))
    } catch (error) {
      console.log(error)
    }
  }

  const handleVariant = (variant) => {
    setQuantity(1)
    setSeletedVariant(variant._id)
    setPrice(variant.price)
    setDiscountPrice(variant.discount_price)
    variant.stock_count > 0 ? setinStock(true) : setinStock(false)
  }

  const addToWishlist = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/buyer/addonwishlist/${_id}`, {}, { withCredentials: true })
    } catch (error) {
      toast.error('Login first')
      navigate('/login')
    }
  }

  const addToCart = async () => {
    const item = {
      pid: id,
      vid: selectedVariant,
      name: name,
      price,
      discount_price,
      qty: quantity,
      img: productImages[0]
    }
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/buyer/addoncart`,{
        productId: _id,
        variantId: selectedVariant,
        quantity: quantity
      }, { withCredentials: true })
      dispatch(addtocart(item))
    } catch (error) {
      dispatch(addtocart(item))
    }
  }

  return (
    <>
      <div className="min-h-screen bg-offwhite font-Manrope mt-24">
        <div className="mx-auto px-4 py-8 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-offwhite rounded-2xl overflow-hidden border">
                <img
                  src={productImages[selectedImage]?.url}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-6 gap-3">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-offwhite rounded-lg overflow-hidden border-2 transition-all duration-300 ${selectedImage === index
                      ? 'border-DeepNavy shadow-lg'
                      : 'border-warmgrey/30 hover:border-warmgrey'
                      }`}
                  >
                    <img
                      src={image.url}
                      alt={`Product view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Product Title & Rating */}
              <div>
                <span className="inline-flex items-center rounded-full border border-transparent bg-warmgrey text-CharcoalBlack hover:bg-warmgrey/70 px-2.5 py-0.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 mb-3">{category}</span>
                <h1 className="font-Playfair text-3xl md:text-4xl font-bold text-deep-navy-dark leading-tight mb-4">
                  {name}
                </h1>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-warmgrey">{brand}</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4">
                <span className="font-Playfair text-3xl font-bold text-DeepNavy">₹{discount_price}</span>
                <span className={`text-xl text-warmgrey line-through font-sans ${discount > 0 ? 'block' : 'hidden'}`}>₹{price}</span>
                <span className={` items-center rounded-full border border-transparent bg-emeraldgreen text-offwhite hover:bg-emeraldgreen/80 px-2.5 py-0.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${discount > 0 ? 'inline-flex' : 'hidden'}`}>{discount}% OFF</span>
              </div>

              {/* Product Description */}
              <div className="space-y-4">
                <p className="text-warmgrey/80 leading-relaxed ">
                  {description}
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm ">
                  <div className="flex items-center gap-2">
                    <FiTruck className="text-emeraldgreen" />
                    <span className=' text-CharcoalBlack'>Free Shipping</span>
                  </div>
                  <div className={`flex items-center gap-2 ${instock ? 'block' : 'hidden'}`}>
                    <span className="w-3 h-3 bg-green-600 rounded-full"></span>
                    <span className=' text-CharcoalBlack'>In Stock</span>
                  </div>
                  <div className={`flex items-center gap-2 ${!instock ? 'block' : 'hidden'}`}>
                    <span className="w-3 h-3 bg-red-800 rounded-full"></span>
                    <span className=' text-CharcoalBlack'>Out Stock</span>
                  </div>
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <h3 className="text-DeepNavy mb-3">Varieties ({attribute})</h3>
                <div className="flex space-x-2">
                  {varietys.map((variant) => (
                    <button key={variant._id} className={`cursor-pointer px-2.5 py-1 rounded-sm border-deep-navy shadow-lg text-sm font-sans text-white ${selectedVariant === variant._id ? 'bg-emeraldgreen/50' : 'bg-emeraldgreen hover:bg-emeraldgreen/80 hover:scale-105 transition-all duration-500'} `} onClick={() => handleVariant(variant)}>{variant.variant_name}</button>
                  ))}
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="space-y-4">
                <div>
                  <h3 className=" text-DeepNavy mb-3">Quantity</h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg border border-warmgrey/30 flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-lg border border-warmgrey/30 flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 h-12 bg-DeepNavy hover:bg-DeepNavy/90 text-white inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-[15px] ring-offset-offwhite focus-visible:outline-none focus-visible:ring-2  focus-visible:ring-offset-2 cursor-pointer disabled:opacity-50 hover:scale-105 transition-all duration-500">
                    Order Now
                  </button>
                  <button className="h-12 w-12 text-DeepNavy border border-warmgrey/50 bg-offwhite hover:bg-gold inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-offwhite transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer disabled:opacity-50"
                    onClick={addToCart}>
                    <FiShoppingCart />
                  </button>
                  <button className="h-12 w-12 text-DeepNavy border border-warmgrey/50 bg-offwhite hover:bg-gold inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-offwhite transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer disabled:opacity-50"
                    onClick={addToWishlist}>
                    <FiHeart />
                  </button>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="rounded-lg border bg-offwhite shadow-sm border-warmgrey/20">
                <div className="p-6">
                  <h3 className="font-Playfair text-xl mb-4">Customer Reviews</h3>
                  <div className="h-64 overflow-auto relative">
                    <div className="space-y-4 pr-4">
                      {/* {reviews.map((review) => (
                        <div key={review.id} className="border-b border-warmgrey/20 pb-4 last:border-b-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{review.name}</h4>
                            <span className="text-sm text-warmgrey">{review.date}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            {renderStars(review.rating)}
                          </div>
                          <p className="text-sm text-wramgrey">{review.comment}</p>
                        </div>
                      ))} */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          <div>
            <h2 className="font-Playfair text-3xl font-semibold text-deep-navy-dark mb-8">Related Products</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product._id} {...product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Product
