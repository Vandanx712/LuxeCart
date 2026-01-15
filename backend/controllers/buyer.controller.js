import { ApiError } from "../utill/apierror.js";
import { asynchandller } from "../utill/asynchandller.js";
import { Buyer } from '../models/buyer/buyer.model.js'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import sendWelcomeEmail from "../notification/sentWelcomeMail.js";
import { Coin } from "../models/buyer/coin.model.js";
import { findUserByEmail } from "./common.controller.js";
import {Product} from '../models/product/product.model.js'
import { Wishlist } from "../models/buyer/wishlist.model.js";
import {Cart} from '../models/buyer/cart.model.js'
import mongoose from "mongoose";
import { ProductVariant } from "../models/product/productvariant.model.js";
import { Orderitem } from "../models/order/orderitem.model.js";
import { Order } from "../models/order/order.model.js";
import { Payment } from "../models/order/payment.model.js";
import { Seller } from "../models/seller/seller.model.js";
import sentStockAlertEmail from "../notification/sentStockAlert.js";
import sentOrderInfomail from "../notification/sentOrderInfomail.js";
import Razorpay from "razorpay";


dotenv.config()
export const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


export const registerBuyer = asynchandller(async (req, res) => {
    const { username,name, email, phone, password } = req.body

    if ([username,name, email, phone, password].some((field) => field === '')) {
        throw new ApiError(404, 'Plz fill all field')
    }

    const existbuyer = await Buyer.findOne({
        $or: [{ email: email }, { phone: phone }, { username: username }]
    })

    const user = await findUserByEmail(email)

    if (existbuyer) {
        if (username === existbuyer.username) throw new ApiError(404, 'Username is already exist')
        if (email === existbuyer.email) throw new ApiError(404, 'Email is already exist')
        if (phone === existbuyer.phone) throw new ApiError(404, 'Phone is already exist')
    }
            
    if(user) throw new ApiError(429,'Email already exist')

    const newBuyer = await Buyer.create({
        username:username.toLowerCase(),
        name: name,
        email: email.toLowerCase(),
        phone: phone,
        password: await bcrypt.hash(password, 10)
    })

    sendWelcomeEmail(newBuyer)

    const [wishlist,cart,coin] = await Promise.all([
        Wishlist.create({buyer:newBuyer.id}),
        Cart.create({buyer:newBuyer.id}),
        Coin.create({buyer: newBuyer.id,coincount: 100})
    ])

    return res.status(200).json({
        message: 'Register successful',
        newBuyer: newBuyer
    })
})


export const updateBuyer = asynchandller(async (req, res) => {
    const { username,name, email, phone } = req.body
    const buyerId = req.user.id

    const existbuyer = await Buyer.findOne({
        $or: [{ username }, { email }, { phone }]
    })

    const user = await findUserByEmail(email)

    if (existbuyer) {
        if (username === existbuyer.username && existbuyer.id !== buyerId) throw new ApiError(400, 'Username already exist')
        if (email === existbuyer.email && existbuyer.id !== buyerId) throw new ApiError(400, 'Email already exist')
        if (phone === existbuyer.phone && existbuyer.id !== buyerId) throw new ApiError(400, 'PhoneNo already exist')
    }

    if(user.id !== buyerId) throw new ApiError(429,'Email already exist')

    const updatedBuyer = await Buyer.findByIdAndUpdate(buyerId, { $set: { username,name, email, phone } },{new:true}).select('-password')

    return res.status(200).json({
        message: 'Buyer profile update successfully',
        updatedBuyer: updatedBuyer
    })
})


export const getBuyerbyId = asynchandller(async(req,res)=>{
    const {buyerId} = req.params

    if(!buyerId) throw new ApiError(409,'Something miss')

    const buyer = await Buyer.findById(buyerId).select('-password')
    if(!buyer) throw new ApiError(404,'Buyer not found')

    return res.status(200).json({
        message:'Fetch Buyer successfully',
        buyer
    })
})

export const getBuyerCoin = asynchandller(async(req,res)=>{
    const buyerId = req.user.id

    const coins = await Coin.findOne({buyer:buyerId})
    if(!coins) throw new ApiError(404,"Coins not found")

    return res.status(200).json({
        message:'Fetch buyer coin successfully',
        coins
    })
})


// wish list part 

export const addProductInWishlist = asynchandller(async (req, res) => {
    const { productId } = req.params
    const buyerId = req.user.id

    const product = await Product.findById(productId).select('_id name')
    if (!product) throw new ApiError(404, 'Product not found')

    const existWishlist = await Wishlist.findOne({ buyer: buyerId })

    if (existWishlist) {
        const existedproductid = existWishlist.products.find(ptid=>ptid.toString()===productId)
        if (existedproductid) {
            return res.status(200).json({
                message: "Product add in wishlist successfully",
            })
        }
        else{
            existWishlist.products.push(productId)
        }
        await existWishlist.save()

        return res.status(200).json({
            message: "Product add in wishlist successfully",
            existWishlist
        })
    }
})

export const removeProductfromWishlist = asynchandller(async(req,res)=>{
    const {productId,listId} = req.params

    const product = await Product.findById(productId).select('_id name')
    if(!product) throw new ApiError(404,"Product not found")

    const wishlist = await Wishlist.findByIdAndUpdate(listId, { $pull: { products: productId } })
    if(!wishlist) throw new ApiError(404,"Wishlist not found")

    return res.status(200).json({
        message: "Product remove from wishlist successfully",
    })
})

export const getListById = asynchandller(async(req,res)=>{
    const {listId} = req.params
    const buyerId = req.user.id

    const buyerWishlist = await Wishlist.findOne({_id:list,buyer:buyerId})
    if(!buyerWishlist) throw new ApiError(404,'Wishlist not found')

    return res.status(200).json({
        message:'Fetch wishlist successfully',
        buyerWishlist
    })
})

export const getAllWishlistProducts = asynchandller(async(req,res)=>{
    const buyerId = req.user.id
    const wishlistProducts = await Wishlist.aggregate([
        {
            $match:{
                buyer: new mongoose.Types.ObjectId(buyerId)
            }
        },
        {
            $lookup:{
                from:"products",
                localField:'products',
                foreignField:'_id',
                as:'products',
                pipeline:[
                    {
                        $project:{
                            name:1,
                            price:1,
                            discount_price:1,
                            brand:1,
                            images:1
                        }
                    }
                ]
            }
        }
    ])

    let wishlist
    if (wishlistProducts.length == 0) {
        wishlist = await Cart.findOne({ buyer: buyerId })
    }

    return res.status(200).json({
        message:"Fetch all wishlist products",
        wishlistProducts: wishlistProducts.length === 0 ? wishlist : wishlistProducts[0]
    })
})

// Cart part 

// const existedproduct = await Cart.findOne({'items.product':productId},{'items.$':1}) kaam aavse array ni under ni field thi find karvu hoy tyare use
export const addProductInCart = asynchandller(async (req, res) => {
    const { productId, variantId, quantity } = req.body
    const buyerId = req.user.id

    const [product,cart] = await Promise.all([
        Product.findById(productId).select('_id name variants'),
        Cart.findOne({ buyer: buyerId })
    ])
    
    if (!product) throw new ApiError(404, "Product not found")
    const variant = await ProductVariant.findById(variantId ?? product.variants[0].toString()).select('_id variant_name discount_price')


    let totalprice = cart.totalprice
    const existingitem = cart.items.find(item => item.product.toString() === productId && item.variant.toString() === variant.id)
    if (existingitem) {
        existingitem.quantity += quantity
        totalprice += variant.discount_price * quantity
    }
    else {
        cart.items.push({ product: productId, variant: variant.id, quantity: quantity })
        totalprice += variant.discount_price * quantity
    }
    cart.totalprice = totalprice
    await cart.save()
    return res.status(200).json({
        message: 'Product add successfully',
        cart,
        variantId:variant.id
    })
}) // aaj api jyare buyer cart ma jaine quantity decrease kare tyare pan aaj api use thase

export const removeProductfromCart = asynchandller(async (req, res) => {
    const { productId, variantId } = req.params
    const buyerId = req.user.id

    const [product, variant, cart] = await Promise.all([
        Product.findById(productId).select('_id name'),
        ProductVariant.findById(variantId).select('_id variant_name discount_price'),
        Cart.findOne({ buyer: buyerId })
    ])
    if (!product || !variant) throw new ApiError(404, "Product or variant not found")

    const itemIndex = cart.items.findIndex(
        item =>
            item.product.toString() === productId.toString() &&
            item.variant.toString() === variantId.toString()
    );

    if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item not found in cart' });
    }

    const itemToRemove = cart.items[itemIndex];
    const productPrice = variant.discount_price * itemToRemove.quantity;
    cart.items.splice(itemIndex, 1);
    cart.totalprice -= productPrice;
    await cart.save();

    return res.status(200).json({
        message: 'Remove product successfully',
        cart
    })
})

export const getCartById = asynchandller(async(req,res)=>{
    const {cartId} = req.params
    const buyerId = req.user

    const buyerCart = await Cart.findOne({_id:cartId,buyer:buyerId})
    if(!buyerCart) throw new ApiError(404,'Cart not found')
    
    return res.status(200).json({
        message:'Fetch cart successfully',
        buyerCart
    })
})

export const getAllCartProducts = asynchandller(async (req, res) => {
  const buyerId = req.user.id;

  const cartProducts = await Cart.aggregate([
    {
      $match: {
        buyer: new mongoose.Types.ObjectId(buyerId)
      }
    },
    { $unwind: "$items" },
    {
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "productDetails",
        pipeline:[
            {
                $project:{
                    name:1,
                    images:1
                }
            }
        ]
      }
    },
    {
      $lookup: {
        from: "productvariants", 
        localField: "items.variant",
        foreignField: "_id",
        as: "variantDetails",
        pipeline:[
            {
                $project:{
                    variant_name:1,
                    price:1,
                    discount_price:1,
                }
            }
        ]
      }
    },
    {
      $unwind: {
        path: "$productDetails",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $unwind: {
        path: "$variantDetails",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: "$_id",
        buyer: { $first: "$buyer" },
        totalprice: { $first: "$totalprice" },
        items: {
          $push: {
            product: "$items.product",
            variant: "$items.variant",
            quantity: "$items.quantity",
            productDetails: "$productDetails",
            variantDetails: "$variantDetails"
          }
        }
      }
    }
  ]);
  
  let cart
  if(cartProducts.length===0) {
    cart = await Cart.findOne({buyer:buyerId})
  }

  return res.status(200).json({
    message: "Fetched all cart products successfully",
    cartProducts:cartProducts.length==0 ? cart : cartProducts[0]
  });
});


// Order part 

export const createOrderFromCart= asynchandller(async(req,res)=>{
    const {items,address,payment_method} = req.body
    const buyerId = req.user.id

    let totalprice = 0
    const groupedItems = {}

    for(const item of items){
        const product = await Product.findById(item.pid)
        const variant = await ProductVariant.findById(item.vid)
        const SellerId = product.seller.toString()
        const seller = await Seller.findById(SellerId)

        if (variant.stock_count <= 1) {
            sentStockAlertEmail(seller.email,seller.username,product.name,variant.variant_name)
        }

        if(!groupedItems[SellerId]){
            groupedItems[SellerId] = []
        }
        groupedItems[SellerId].push({...item,SellerId})
    }

    for(const SellerId in groupedItems){
        const sellerItems = groupedItems[SellerId]
        
        const orderItems = await Promise.all(
            sellerItems.map(async(item)=>{
                const variant = await ProductVariant.findById(item.vid)
                const orderItem = await Orderitem.create({
                    product:item.pid,
                    variant:item.vid,
                    quantity:item.qty,
                    price:variant.discount_price
                })
                totalprice += variant.discount_price*item.qty
                variant.stock_count -= item.qty
                await variant.save()
                return orderItem
            })
        )
        
        const order = await Order.create({
            buyer:buyerId,
            seller:SellerId,
            items:orderItems,
            total_price:totalprice,
            shipping_address:address
        })
        const seller = await Seller.findById(SellerId)

        seller.orders.push(order._id)
        await seller.save()
        sentOrderInfomail(seller)

        if(payment_method !=='Cash on Delivery'){
            const razorpayOrder = await razorpayInstance.orders.create({
                amount:totalprice,
                currency:'INR',
                receipt:`receipt_order_${order.id}`
            })
            await Payment.create({
                order:order.id,
                buyer:buyerId,
                payment_method:payment_method,
                transaction_id:razorpayOrder.id,
                payment_status:'Pending'
            })

            return res.status(200).json({
                message:'Razorpay order create successfully',
                razorpayOrderId:razorpayOrder.id,
                amount:totalprice,
                currency:'INR',
                orderId:order.id
            })
        }
        else{
            await Payment.create({
                order:order._id,
                buyer:buyerId,
                payment_method:'Cash on Delivery',
                amount:totalprice
            })
    
            return res.status(200).json({
                message:'Order created with Cash on Delivery',
                order
            })
        }
    }
})

export const createOrderForSingle = asynchandller(async(req,res)=>{
    const {productId,variantId,quantity,address,payment_method} = req.body
    const buyerId = req.user.id

    const [product,variant] = await Promise.all([
        Product.findById(productId),
        ProductVariant.findById(variantId)
    ])
    if(!product) throw new ApiError(404,"Product not found with given id")
    if(!variantId) throw new ApiError(404,'Productvariant not found with given id')

    const seller = await Seller.findById(product.seller.toString())
    if(!seller) throw new ApiError(404,'Seller not found')

    if(variant.stock_count <= 1){
        await sentStockAlertEmail(seller.email,seller.username,product.name,variant.variant_name)
    }

    const orderitem = await Orderitem.create({
        product: product.id,
        variant: variant.id,
        quantity: quantity,
        price: variant.discount_price
    })

    const order = await Order.create({
        buyer: buyerId,
        seller: seller.id,
        items: orderitem,
        shipping_address: address,
        total_price: variant.discount_price * quantity
    })
    variant.stock_count -= quantity
    await variant.save()
    seller.orders.push(order._id)
    await seller.save()
    await sentOrderInfomail(seller)

    if (payment_method !== 'Cash on Delivery') {
        const razorpayOrder = await razorpayInstance.orders.create({
            amount: totalprice,
            currency: 'INR',
            receipt: `receipt_order_${order.id}`
        })
        await Payment.create({
            order: order.id,
            buyer: buyerId,
            payment_method: payment_method,
            transaction_id: razorpayOrder.id,
            payment_status: 'Pending'
        })

        return res.status(200).json({
            message: 'Razorpay order create successfully',
            razorpayOrderId: razorpayOrder.id,
            amount: totalprice,
            currency: 'INR',
            orderId: order.id
        })
    }
    else {
        await Payment.create({
            order: order._id,
            buyer: buyerId,
            payment_method: 'Cash on Delivery',
            amount: order.total_price
        })

        return res.status(200).json({
            message: 'Order created with Cash on Delivery',
            order
        })
    }
})

export const verifyPayment = asynchandller(async(req,res)=>{
    try {
        const {razorpay_order_id,razorpay_payment_id,razorpay_signature,orderId} = req.body
    
        const generatedSignature = crypto
            .createHmac("van123", process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex')
    
        if(generatedSignature !== razorpay_signature) throw new ApiError(400,'Invalid signature')
        await Payment.findOneAndUpdate({transaction_id:razorpay_order_id},{payment_status:'Completed'},{new:true})
        await Order.findByIdAndUpdate(orderId,{payment_status:'Completed'},{new:true})
        
        return res.status(200).json({
            message:'Payment verified successfully'
        })
    } catch (error) {
        console.error("Payment verification failed:", err);
        return res.status(500).json({ error: "Payment verification failed" });
    }
})

export const getallOrder = asynchandller(async(req,res)=>{
    const user = req.user 
    const orders = await Order.aggregate([
        {
            $match:{
                buyer: new mongoose.Types.ObjectId(user.id)
            }
        },
        { $unwind: "$items" },
        {
            $lookup:{
                from:'products',
                localField:'items.product',
                foreignField:'_id',
                as:'product',
                pipeline:[
                    {
                        $project:{
                            name:true,
                            images:true
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: 'productvariants',
                localField: 'items.variant',
                foreignField: '_id',
                as: 'variant',
                pipeline: [
                    {
                        $project: {
                            variant_name: true,
                            price: true,
                            discount_price: true,
                        }
                    }
                ]
            }
        },
        {
            $unwind: {
                path: "$product",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $unwind: {
                path: "$variant",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: "$_id",
                buyer: { $first: "$buyer" },
                seller: { $first: "$seller" },
                totalprice: { $first: "$total_price" },
                order_status:{$first:"$order_status"},
                placedon:{$first:'$createdAt'},
                items: {
                    $push: {
                        name: "$product.name",
                        variantname: "$variant.variant_name",
                        quantity: "$items.quantity",
                        price:'$variant.price',
                        discount_price:'$variant.discount_price',
                        image:'$product.imges[0]'
                    }
                }
            }
        }
    ])

    return res.status(200).json({
        message:'Fetch all order',
        orders
    })
})