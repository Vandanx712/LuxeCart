import { Seller } from "../models/seller/seller.model.js";
import { ApiError } from "../utill/apierror.js";
import { asynchandller } from "../utill/asynchandller.js";
import bcrypt from 'bcrypt'
import { generateAccessToken, generateRefreshToken } from "./login.controller.js";
import { DeliveryBoy } from "../models/seller/deliveryboy.model.js";
import sendAccountDetailEmail from "../notification/sentAccountDetail.js";
import { findUserByEmail } from "./common.controller.js";
import { ProductAttribute } from "../models/product/productattribute.model.js";
import { ProductVariant } from "../models/product/productvariant.model.js";
import fs from 'fs/promises'
import path from "path";
import { Product } from "../models/product/product.model.js";
import { Order } from '../models/order/order.model.js'
import sentOrderInfoForBoy from "../notification/sentOrderInfoForBoy.js";
import mongoose from "mongoose";
import { Buyer } from "../models/buyer/buyer.model.js";
import { Category } from "../models/admin/category.model.js";
import { Address } from "../models/address.model.js";



export const sellerRegister = asynchandller(async (req, res) => {
    const { username, name, email, phone, password, shopname } = req.body

    if ([username, name, email, phone, password, shopname].some((field) => field === '')) {
        throw new ApiError(404, 'Plz fill all field')
    }

    const existseller = await Seller.findOne({
        $or: [{ username: username }, { email: email }, { phone: phone }]
    })

    const user = await findUserByEmail(email)

    if (existseller) {
        if (username === existseller.username) throw new ApiError(404, 'Name is already exist')
        if (email === existseller.email) throw new ApiError(404, 'Email is already exist')
        if (phone === existseller.phone) throw new ApiError(404, 'PhoneNO is already exist')
    }

    if (user) throw new ApiError(429, 'Email already exist')

    const newSeller = await Seller.create({
        username: username.toLowerCase(),
        name: name,
        email: email.toLowerCase(),
        phone: phone,
        password: await bcrypt.hash(password, 10),
        shopname: shopname
    })

    return res.status(200).json({
        message: 'Register successful',
        newSeller: newSeller
    })
})


export const sellerlogin = asynchandller(async (req, res) => {
    const { email, password } = req.body

    if ([email, password].some((field) => field === '')) {
        throw new ApiError(404, 'Plz fill all field')
    }

    const seller = await Seller.findOne({ email: email })

    if (!seller) throw new ApiError(404, 'Seller not found')

    const passwordvalid = await bcrypt.compare(password, seller.password)
    if (!passwordvalid) throw new ApiError(404, 'Plz enter correct password')

    const accessToken = await generateAccessToken(seller)
    const refreshToken = await generateRefreshToken(seller.id)

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json({
            message: 'Login successful',
            seller: seller
        })
})


export const updateSeller = asynchandller(async (req, res) => {
    const { username, name, email, phone, shopname } = req.body
    const sellerId = req.user.id

    const existSeller = await Seller.findOne({ $or: [{ email }, { username }, { phone }] }).select('username email phone')

    const user = await findUserByEmail(email)

    if (existSeller) {
        if (username === existSeller.username && existSeller.id !== sellerId) throw new ApiError(400, 'Username already exist')
        if (email === existSeller.email && existSeller.id !== sellerId) throw new ApiError(400, 'Email already exist')
        if (phone === existSeller.phone && existSeller.id !== sellerId) throw new ApiError(400, 'PhoneNo already exist')
    }

    if (user.id !== sellerId) throw new ApiError(429, 'Email already exist')

    const updatedSeller = await Seller.findByIdAndUpdate(sellerId, { $set: { email, username, name, phone, shopname } },{new:true})
    if(!updatedSeller) throw new ApiError(404,'Seller not found')
    return res.status(200).json({
        message: 'Seller profile update successfully',
        updatedSeller
    })
})

export const getSellerById = asynchandller(async (req, res) => {
    const { sellerId } = req.params
    if (!sellerId) throw new ApiError(429, 'Plz pass seller id')

    const seller = await Seller.findById(sellerId).select('-password')
    if (!seller) throw new ApiError(404, 'Seller not found')

    return res.status(200).json({
        message: 'Fetch seller successfully',
        seller
    })  
})


// delivery boy part

export const createDeliveryBoy = asynchandller(async (req, res) => {
    const { username, name, email, phone, password, vehicle_type, vehicle_number } = req.body

    if ([username, name, email, phone, password, vehicle_number, vehicle_type].some((field) => field === '')) throw new ApiError(404, 'Plz fill all field')

    const existBoy = await DeliveryBoy.findOne({
        $or: [{ username: username }, { email: email }, { phone: phone }]
    }).select('name email phone')

    const user = await findUserByEmail(email)

    if (existBoy) {
        if (username == existBoy.username) throw new ApiError(404, 'Username already exist')
        if (email == existBoy.email) throw new ApiError(404, 'User email already exist')
        if (phone == existBoy.password) throw new ApiError(404, 'User phone already exist')
    }

    if (user) throw new ApiError(429, 'Email already exist')

    const newDeliveryBoy = await DeliveryBoy.create({
        username: username.toLowerCase(),
        name: name,
        email: email.toLowerCase(),
        phone,
        password: await bcrypt.hash(password, 10),
        createBy: req.user.id,
        vehicle_type,
        vehicle_number,
    })
    sendAccountDetailEmail(newDeliveryBoy,password)

    return res.status(200).json({
        message: 'Register DeliveryBoy successfully',
        newDeliveryBoy
    })
})

export const getAllDeliveryBoy = asynchandller(async(req,res)=>{
    const user = req.user
    if(user.role !== 'seller' || user.role !== 'admin') throw new ApiError(400,'You are not authorized perform this operation.')

    const totalBoys = await DeliveryBoy.find({createBy:user.id})
    const countboy = totalBoys.length

    return res.status(200).json({
        message:'Fetch all deliveryboys',
        totalBoys,
        countboy
    })
})

export const getOndeliveryBoy = asynchandller(async(req,res)=>{
    const user = req.user
    if(user.role !== 'seller') throw new ApiError(400,'You are not authorized perform this operation.')
    const deliveryboy = await DeliveryBoy.find({createBy:user.id},{is_ondelivery:true})
    const countboy = deliveryboy.length

    return res.status(200).json({
        message:"Fetch all is_ondelivery deliveryboy",
        deliveryboy,
        countboy
    })
})

export const getFreedeliveryBoy = asynchandller(async(req,res)=>{
    const user = req.user
    if(user.role !== 'seller') throw new ApiError(400,'You are not authorized perform this operation.')
    const deliveryboy = await DeliveryBoy.find({createBy:user.id},{is_ondelivery:false})
    const countboy = deliveryboy.length

    return res.status(200).json({
        message:"Fetch all free deliveryboy",
        deliveryboy,
        countboy
    })
})

/// product upload part ///

export const uploadProduct = asynchandller(async (req, res) => {
    const { name, description, discount, category, subcategory, brand, variants } = req.body
    if([name,description,category,subcategory].some((field)=>field=='')) throw new ApiError(429,'Plz fill all field')

    const existproduct = await Product.findOne({
        name: { $regex: name.trim(), $options: 'i' },
        brand: { $regex: brand.trim(), $options: 'i' }
    })
    if(existproduct) throw new ApiError(409,'Product name already exist for given brand')

    const parsedVariants = variants || JSON.parse(variants)  // from multipart form

    let variantIds = []
    const filepath = `uploads/admin`
    const file = path.join(filepath, 'adminAttribute.txt')
    const filecontent = await fs.readFile(file, 'utf-8')
    const adminAttribute = await ProductAttribute.findById(filecontent)

    for(let variant of parsedVariants){
        let attributeIds = []
        const allAttributes = []
        for (let attribute of variant.attributes) {
            if (!adminAttribute.value.includes(attribute.key.toLowerCase())) throw new ApiError(400, 'Plz enter valid key')
            const exictattr = allAttributes.find((attr)=>attr.key===attribute.key && attr.value===attribute.value)
            if(!exictattr){
                const attributeDoc = await ProductAttribute.create({
                  key: attribute.key,
                  value: attribute.value,
                });
                attributeIds.push(attributeDoc.id)
                allAttributes.push(attribute)
            } 
        }
        const Variantprice = variant.price
        const discountprice = Variantprice - ((Variantprice * discount)/100)
        const variantDoc = new ProductVariant({
            variant_name:variant.name,
            price:Variantprice,
            discount_price:discountprice,
            stock_count:variant.stock,
            is_default_Variant:variant.defaultVariant,
            attributes:attributeIds
        })
        await variantDoc.save()
        variantIds.push(variantDoc.id)
    }

    const productvariants= await Promise.all(variantIds.map(async(variId)=>ProductVariant.findById(variId)))
    const defaultVariant = productvariants.filter((vari)=>vari.is_default_Variant==true)

    const product = await Product.create({
        name,
        description,
        price:defaultVariant[0].price,
        discount,
        discount_price:defaultVariant[0].discount_price,
        category,
        subcategory,
        seller:req.user.id,
        brand,
        stock_count:defaultVariant.stock_count,
        variants:variantIds
    })

    return res.status(200).json({
        message:'Product upload successfully',
        product
    })
})
// this is use for update and upload product images
export const updateProductImg = asynchandller(async(req,res)=>{
    const {productId,productImg} = req.body
    const sellerId = req.user.id

    const product = await Product.findOneAndUpdate({_id:productId,seller:sellerId},{$set:{images:productImg}},{new:true})
    if(!product) throw new ApiError(404,'Product not found')

    return res.status(200).json({
        message:'Product update successfully',  
        images:product.images
    })
})

export const productUpdate = asynchandller(async(req,res)=>{
    const {productId,name,description,brand,category,subcategory,discount} = req.body
    const product = await Product.findByIdAndUpdate(productId,{$set:{name,description,brand,category,subcategory,discount}},{new:true})
    if(!product) throw new ApiError(404,"Product not found")

    return res.status(200).json({
        message:'Product update successfully',
        product
    })
})

export const productDelete = asynchandller(async (req, res) => {
    const { productId } = req.params

    const product = await Product.findById(productId)
    if (!product) throw new ApiError(404, 'Product not found with given id')

    const productImages = product.images
    const variants = await Promise.all(product.variants.map(async (vari) => ProductVariant.findById(vari)))
    const attributes = variants.map((vari) => vari.attributes).flat()

    await ProductAttribute.deleteMany({ _id: { $in: attributes } })
    await ProductVariant.deleteMany({ _id: { $in: product.variants } })

    await Product.deleteOne({_id:productId})
    // ahi have Aws mathi product photos pan delete karava padse tenu logic aavse 
    return res.status(200).json({
        message: 'Product delete successfully'
    })
})
// productattribute and productvariant part :--


export const updateAttribute = asynchandller(async (req, res) => {
    const { attributeId, key, value } = req.body
    const sellerId = req.user._id

    const variant = await ProductVariant.findOne({
        attributes: attributeId,
    });

    const product = await Product.findOne({
        variants: variant?._id,
        seller: sellerId,
    });
    if (!product) return res.status(403).json({ message: "Unauthorized" });

    const filepath = `uploads/admin`
    const file = path.join(filepath, 'adminAttribute.txt')
    const filecontent = await fs.readFile(file, 'utf-8')
    const adminAttribute = await ProductAttribute.findById(filecontent)
    if (!adminAttribute.value.includes(key.toLowerCase())) throw new ApiError(400, 'Plz enter valid key')

    const updatedAttribute = await ProductAttribute.findById(attributeId);
    if (!updatedAttribute) return res.status(404).json({ message: "Attribute not found" });

    updatedAttribute.key = key ?? updatedAttribute.key;
    updatedAttribute.value = value ?? updatedAttribute.value;

    await updatedAttribute.save();
    return res.status(200).json({
        message: 'Update your attribute successfully',
        updatedAttribute
    })
})

export const deleteAttribute = asynchandller(async (req, res) => {
    const { attributeId } = req.params
    const sellerId = req.user._id

    const variant = await ProductVariant.findOne({ attributes: attributeId });
    const product = await Product.findOne({
        variants: variant?._id,
        seller: sellerId,
    });

    if (!product) return res.status(403).json({ message: "Unauthorized" });

    variant.attributes.pull(attributeId);
    await variant.save();

    await ProductAttribute.findByIdAndDelete(attributeId);
    return res.status(200).json({
        message: 'Attribute delete successfully'
    })
})


export const updateVariant = asynchandller(async(req,res)=>{
    const {variantId,variantName,price,stock} = req.body
    const sellerId = req.user._id

    const variant = await ProductVariant.findById(variantId)
    if(!variant) throw new ApiError(404,'Variant not found')
    
    const product = await Product.findOne({
        variants:variant?._id,
        seller:sellerId
    })

    if (!product) return res.status(403).json({ message: "Unauthorized" });
    variant.price = price ?? variant.price;
    variant.stock_count = stock ?? variant.stock_count;
    variant.variant_name = variantName ?? variant.variant_name;

    await variant.save()

    return res.status(200).json({
        message:'Productvariant update successfully',
        variant
    })
})

export const deleteVariant = asynchandller(async (req, res) => {
    const { variantId } = req.params
    const sellerId = req.user._id

    const product = await Product.findOne({
        variants: variantId,
        seller: sellerId,
    });
    const variant = await ProductVariant.findById(variantId)
    if(!variant) throw new ApiError(404,'Variant not found')

    product.variants.pull(variantId);
    await product.save();

    await ProductAttribute.deleteMany({id:{$in:variant.attributes}})
    await ProductVariant.findByIdAndDelete(variantId);

    return res.status(200).json({
        message: "Productvariant delete successfully"
    })
})

// order part 

export const getOrderByStatus = asynchandller(async(req,res)=>{
    const sellerId = req.user.id
    const {order_status}= req.body

    const sellerOrders = await Order.find({seller:sellerId,order_status:order_status}).sort({createdAt:-1})
    const totalOrder = sellerOrders.length

    return res.status(200).json({
        message:'Fetch all order by status successfully',
        sellerOrders,
        totalOrder
    })
})

export const getOrderById = asynchandller(async (req, res) => {
    const {orderId} = req.params

    const match = {
        $match: {
            _id: new mongoose.Types.ObjectId(orderId),
        }
    };

    const lookupproduct = {
        $lookup: {
            from: 'products',
            localField: 'items.product',
            foreignField: '_id',
            as: 'items.product',
            pipeline: [
                {
                    $project: {
                        name: 1,
                        images: 1
                    }
                }
            ]
        }
    };

    const lookupvariant = {
        $lookup: {
            from: 'productvariants',
            localField: 'items.variant',
            foreignField: '_id',
            as: 'items.variant',
            pipeline: [
                {
                    $project: {
                        variant_name: 1,
                    }
                }
            ]
        }
    };

    const unwindItems = { $unwind: "$items" };
    const unwindProduct = { $unwind: { path: "$items.product", preserveNullAndEmptyArrays: true } };
    const unwindVariant = { $unwind: { path: "$items.variant", preserveNullAndEmptyArrays: true } };
    const shipping_address = {
        $lookup:{
            from:'addresses',
            localField:'shipping_address',
            foreignField:'_id',
            as:'shipping_address',
            pipeline:[
                {
                    $project:{
                        street:1,
                        city:1,
                        state:1,
                        zip_code:1,
                    }
                }
            ]
        }
    }

    const groupItems = {
        $group: {
            _id: "$_id",
            buyer: { $first: "$buyer" },
            seller: { $first: "$seller" },
            delivery_boy: { $first: "$delivery_boy" },
            items: { $push: "$items" },
            total_price: { $first: "$total_price" },
            payment_status: { $first: "$payment_status" },
            order_status: { $first: "$order_status" },
            shipping_address: { $first: "$shipping_address" },
            createdAt: { $first: "$createdAt" },
            updatedAt: { $first: "$updatedAt" }
        }
    };

    const sellerOrders = await Order.aggregate([
        match,
        unwindItems,
        lookupproduct,
        lookupvariant,
        unwindProduct,
        unwindVariant,
        shipping_address,
        groupItems
    ])
    return res.status(200).json({
        message: 'Fetch seller order by order_status',
        sellerOrders
    });
});


export const assignOrder = asynchandller(async(req,res)=>{
    const {deliveryboyId,orderId} = req.body
    const sellerId = req.user.id

    if([deliveryboyId,orderId].some((field)=>field==='')) throw new ApiError(409,'Plz fill all field')
    if(!deliveryboyId) throw new ApiError(400,'DeliveryBoy id is required')
    const deliveryboy = await DeliveryBoy.findById(deliveryboyId)
    if(!deliveryboy || deliveryboy.is_ondelivery==true) throw new ApiError(404,'DeliveryBoy not found or he is on delivery')
    
    const order = await Order.findOneAndUpdate({seller:sellerId,id:orderId},{$set:{delivery_boy:deliveryboyId,order_status:"Shipped"}},{new:true})
    await DeliveryBoy.findByIdAndUpdate(deliveryboy.id,{$set:{is_ondelivery:true}})
    
    sentOrderInfoForBoy(deliveryboy)
    return res.status(200).json({
        message:'Order assign for deliveryBoy successfully',
        order
    })
})


// Seller Dashboard Part

export const orderlist = asynchandller(async(req,res)=>{
    const sellerId = req.user.id

    const sellerorders = await Order.find({seller:sellerId}).select('buyer seller items total_price order_status createdAt').sort({ createdAt: -1 })

    const orders = await Promise.all(
        sellerorders.map(async (order) => {
            const buyername = await Buyer.findById(order.buyer).select('name')
            const product = await Product.findById(order.items[0].product).select('name')
            const productname = order.items.length > 1 ? product.name + ' & more' : product.name

            let time = 'just Now'

            const ordertime = new Date(order.createdAt)
            const nowtime = new Date()
            const diffMs = nowtime - ordertime
            const diffSeconds = Math.floor(diffMs / 1000);
            const diffMinutes = Math.floor(diffSeconds / 60);
            const diffHours = Math.floor(diffMinutes / 60);
            const diffDays = Math.floor(diffHours / 24);
            
            if(diffMinutes > 0) time = `${diffMinutes} minute${diffMinutes >1 ? 's':''} ago`
            if(diffHours > 0) time = `${diffHours} hour${diffHours >1 ? 's':''} ago`
            if (diffDays > 0) time = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`

            return {
                orderid: order.id,
                seller: order.seller,
                buyer: buyername.name,
                products: productname,
                totalitem:order.items.length,
                totalprice: order.total_price,
                status:order.order_status,
                time
            }
        })
    )
    const totalorder = orders.length
    const processing = orders.filter((order)=>order.status=='Processing').length
    const shipped = orders.filter((order)=>order.status=='Shipped').length
    const delivered = orders.filter((order)=>order.status=='Delivered').length
    return res.status(200).json({
        message:'Order list fetch successfully',
        totalorder,
        processing,
        shipped,
        delivered,
        orders
    })
})

export const productlist = asynchandller(async(req,res)=>{
    const sellerId = req.user.id
    
    const sellerProducts = await Product.find({seller:sellerId}).select('seller _id name price discount category variants').sort({ createdAt: -1 })
    
    const products = await Promise.all(
        sellerProducts.map(async (product)=>{
            const category = await Category.findById(product.category).select('name')
            let totalstock = 0
            for(let variant of product.variants){
                const vari = await ProductVariant.findById(variant).select('stock_count')
                totalstock += vari.stock_count
            }
            return {
                productId: product.id,
                seller: product.seller,
                name: product.name,
                price: product.price,
                discount: product.discount,
                procategory: category.name,
                totalstock,
            }
        })
    )
    const totalproduct = products.length
    const instock = products.filter((product)=>product.totalstock >= 5).length
    const lowstock = products.filter((product)=> product.totalstock < 5).length
    const outofstock = products.filter((product)=>product.totalstock == 0).length
    return res.status(200).json({
        message:'Product list fetch succesfully',
        totalproduct,
        instock,
        lowstock,
        outofstock,
        products
    })
})

export const deliveryboylist = asynchandller(async(req,res)=>{
    const sellerId = req.user.id

    const Deliveryboys = await DeliveryBoy.find({createBy:sellerId}).select('username _id name phone email vehicle_type is_ondelivery profileImg createBy').sort({ createdAt: -1 })
    const totaldeliveryboy = Deliveryboys.length
    const free = Deliveryboys.filter((boy)=>boy.is_ondelivery === false).length
    const ondelivery = Deliveryboys.filter((boy)=>boy.is_ondelivery === true).length
    const deliveryboys = await Promise.all(
        Deliveryboys.map(async(boy)=>{
            const orders = (await Order.find({delivery_boy:boy.id,order_status:'Delivered'}).select('id')).length
            return {
                "_id": boy.id,
                "username": boy.username,
                "name": boy.name,
                "email": boy.email,
                "phone": boy.phone,
                "vehicle_type": boy.vehicle_type,
                "is_ondelivery": boy.is_ondelivery,
                "createBy": boy.createBy,
                orders
            }
        })
    )
    return res.status(200).json({
        message:'Deliveryboy list fetch successfully',
        totaldeliveryboy,
        free,
        ondelivery,
        deliveryboys
    })
})

export const filterAllList = asynchandller(async (req, res) => {
    const { item, status, status2, range, range2 } = req.body
    const sellerId = req.user.id

    if (!item) throw new ApiError(400, 'Plz give one item from Order,Product and Deliveryboy')

    let filteredItem = []
    let over1 = 0;
    let exactRange = null;
    let from1 = null
    let to1 = null
    let from = null
    let to = null
    let over2 = 0

    if (range && range.includes('>')) {
        over1 = parseInt(range.split('>')[1]);
    }
    else if (range && range !== 'all' && item !== 'Order') {
        from1 = parseInt(range.split('<')[0]); to1 = parseInt(range.split('<')[1])
    }
    else if (range && range !== 'all' && item == 'Order') {
        exactRange = parseInt(range);
    }
    
    if (range2 && range2.includes('>')) {
        over2 = parseInt(range2.split('>')[1])
    }
    else if (range2 && range2 !== 'all') {
        from = parseInt(range2.split('<')[0]); 
        to = parseInt(range2.split('<')[1])
    }
    
    if (item == 'Order') {
        const sellerorders = await Order.find({ seller: sellerId }).select('buyer seller items total_price order_status createdAt').sort({ createdAt: -1 })
        const filteredorders = sellerorders.filter((order) => {
            let statusmatch = status ? order.order_status == status : true;
            let rangematch = true
            let range2match = true
            if (range && range !== 'all') {
                if (over1) {
                    rangematch = order.items.length > over1;
                } else if (exactRange !== null) {
                    rangematch = order.items.length === exactRange;
                }
            }
            if (range2 && range2 !== 'all') {
                if (over2) range2match = order.total_price > over2
                else if (from !== null && to !== null) range2match = order.total_price >= from && order.total_price <= to;
            }
            return statusmatch && rangematch && range2match
        })
        filteredItem = await Promise.all(
            filteredorders.map(async (order) => {
                const buyername = await Buyer.findById(order.buyer).select('name')
                const product = await Product.findById(order.items[0].product).select('name')
                const productname = order.items.length > 1 ? product.name + ' & more' : product.name

                let time = 'just Now'

                const ordertime = new Date(order.createdAt)
                const nowtime = new Date()
                const diffMs = nowtime - ordertime
                const diffSeconds = Math.floor(diffMs / 1000);
                const diffMinutes = Math.floor(diffSeconds / 60);
                const diffHours = Math.floor(diffMinutes / 60);
                const diffDays = Math.floor(diffHours / 24);

                if (diffMinutes > 0) time = `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`
                if (diffHours > 0) time = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
                if (diffDays > 0) time = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`

                return {
                    orderid: order.id,
                    seller: order.seller,
                    buyer: buyername.name,
                    products: productname,
                    totalitem: order.items.length,
                    totalprice: order.total_price,
                    status: order.order_status,
                    time
                }
            })
        )
    }
    if (item == 'Product') {
        const sellerProducts = await Product.find({ seller: sellerId }).select('seller _id name price discount category variants').sort({ createdAt: -1 })
        const products = await Promise.all(
            sellerProducts.map(async (product) => {
                const category = await Category.findById(product.category).select('name')
                let totalstock = 0
                for (let variant of product.variants) {
                    const vari = await ProductVariant.findById(variant).select('stock_count')
                    totalstock += vari.stock_count
                }
                return {
                    productId: product.id,
                    seller: product.seller,
                    name: product.name,
                    price: product.price,
                    discount: product.discount,
                    procategory: category.name,
                    categoryid: category.id,
                    totalstock,
                }
            })
        )
        filteredItem = products.filter((product) => {
            let statusmatch = true
            let status2match = status2 ? product.categoryid == status2 : true
            let rangematch = true
            let range2match = true

            if (status == 'instock') statusmatch = product.totalstock >= 5
            if (status == 'lowstock') statusmatch = product.totalstock < 5
            if (status == 'outofstock') statusmatch = product.totalstock == 0

            if (range && range != 'all') {
                if (over1) rangematch = product.discount > over1
                else if (from1 !== null && to1 !== null) rangematch = product.discount >= from1 && product.discount <= to1
            }

            if (range2 && range2 !== 'all') {
                if (over2) range2match = product.price > over2
                else if (from !== null && to !== null) range2match = product.price >= from && product.price <= to
            }

            return statusmatch && status2match && rangematch && range2match
        })
    }
    if (item == 'Deliveryboy') {
        const Deliveryboys = await DeliveryBoy.find({ createBy: sellerId }).select('username _id name phone email vehicle_type is_ondelivery profileImg createBy').sort({ createdAt: -1 })
        const deliveryboys = await Promise.all(
            Deliveryboys.map(async (boy) => {
                const orders = (await Order.find({ delivery_boy: boy.id, order_status: 'Delivered' }).select('id')).length
                return {
                    "_id": boy.id,
                    "username": boy.username,
                    "name": boy.name,
                    "email": boy.email,
                    "phone": boy.phone,
                    "vehicle_type": boy.vehicle_type,
                    "is_ondelivery": boy.is_ondelivery,
                    "createBy": boy.createBy,
                    orders
                }
            })
        )
        filteredItem = deliveryboys.filter((boy) => {
            let statusmatch = status ? String(boy.is_ondelivery)== status : true
            let status2match = status2 ? boy.vehicle_type == status2 : true
            let rangematch = true

            if (range && range !== 'all') {
                if (over1) rangematch = boy.orders > over1
                else if (from1 !== null && to1 !== null) rangematch = boy.orders >= from1 && boy.orders <= to1
            }
            return statusmatch && status2match && rangematch
        })
    }
    return res.status(200).json({
        message: 'List filtered successfully',
        filteredItem
    })
})

export const ordergetbyid = asynchandller(async (req, res) => {
    const { orderid } = req.params
    if (!orderid) throw new ApiError(404, 'Orderid is required')

    const order = await Order.findById(orderid)
    const [customer, deliveryboy, shipping_address] = await Promise.all([
        Buyer.findById(order.buyer._id).select('name'),
        DeliveryBoy.findById(order.delivery_boy._id).select('name username'),
        Address.findById(order.shipping_address._id).select('street city state zip_code')
    ])
    const address = `${shipping_address.street}, ${shipping_address.city} ${shipping_address.state}-${shipping_address.zip_code}`
    const date = new Date(order.createdAt)
    const items = await Promise.all(
        order.items.map(async (item) => {
            const product = await Product.findById(item.product).select('name images')
            const variant = await ProductVariant.findById(item.variant).select('variant_name discount_price')

            return {
                'name': product.name,
                'variantname': variant.variant_name,
                'quantity': item.quantity,
                'discount_price': variant.discount_price,
                'image': product.images[0]
            }
        })
    )

    const orderDetail = {
        id: order.id,
        sellerId: order.seller,
        customer: customer.name,
        deliveryboy: `${deliveryboy.username}-${deliveryboy.name}`,
        status: order.order_status,
        payment_status: order.payment_status,
        total_price: order.total_price,
        address,
        date,
        items
    }
    return res.status(200).json({
        message: 'Detail fatch successfully',
        orderDetail
    })
})