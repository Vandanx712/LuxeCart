import { Category } from "../models/admin/category.model.js"
import { ApiError } from "../utill/apierror.js"
import { asynchandller } from "../utill/asynchandller.js"
import {ProductAttribute} from '../models/product/productattribute.model.js'
import { ProductVariant } from "../models/product/productvariant.model.js"
import { Product } from "../models/product/product.model.js"
import mongoose from "mongoose"
import { Cart } from "../models/buyer/cart.model.js"
import { Wishlist } from "../models/buyer/wishlist.model.js"
import { getAiDescription } from "../services/aimodel.js"
import { destroyoldPic } from "../services/cloudstorage.js"



// category part 
export const getCategoryById = asynchandller(async(req,res)=>{
    const {categoryId} = req.params
    const category = await Category.findById(categoryId)
    if(!category) throw new ApiError(404,'Category not found')

    return res.status(200).json({
        message:'Fetch category successfully',
        category
    })
}) // category ane subcategory mate same 

export const getallCategory = asynchandller(async(req,res)=>{
    const categoies = await Category.find({is_subcategory:false,is_active:true})
    return res.status(200).json({
        message:'Fetch all categoies',
        categoies
    })
})

export const getSubcategoryByCategory = asynchandller(async(req,res)=>{
    const {categoryId} = req.params
    const category = await Category.findById(categoryId)
    if(!category) throw new ApiError(404,'Category not found')
    const subcategory = await Category.find({parent:category.id})

    return res.status(200).json({
        message:'Fetch all subcategory of category',
        subcategory
    })
})

export const getCategoryAndSubcategory = asynchandller(async(req,res)=>{
    const categories = await Category.find({is_subcategory:true,is_active:true}).select('_id name parent').populate('parent')
    return res.status(200).json({
        message:'Categories and Subcategoies fetch successfully',
        categories
    })
})

// attribute part  

export const attributegetById = asynchandller(async(req,res)=>{
    const {attributeId} = req.params
    if(!attributeId) throw new ApiError(429,'Plz pass attribute id')

    const attribute = await ProductAttribute.findById(attributeId)
    if(!attribute) throw new ApiError(404,'Attribute not found for given id')

    return res.status(200).json({
        message:"Fetch attribute detail by id successfully",
        attribute
    })
})

export const variantgetById = asynchandller(async(req,res)=>{
    const {variantId} = req.params
    if(!variantId) throw new ApiError(429,"Plz pass variant id")
    
    const variant = await ProductVariant.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(variantId)
            }
        },
        {
            $lookup:{
                from:'productattributes',
                localField:'attributes',
                foreignField:'_id',
                as:'attributes'
            }
        }
    ])
    if(!variant) throw new ApiError(404,"Productvariant not found for given id")

    return res.status(200).json({
        message:'Fetch productvariant by id',
        variant
    })
})

export const productGetById = asynchandller(async(req,res)=>{
    const {productId} = req.params

    const product = await Product.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(productId)
            }
        },
        {
            $lookup:{
                from:"productvariants",
                localField:'variants',
                foreignField:'_id',
                as:'variants',
                pipeline:[
                    {
                        $project:{
                            variant_name:1,
                            price:1,
                            discount_price:1,
                            stock_count:1,
                            is_default_Variant:1,
                            attributes:1,
                        }
                    },
                    {
                        $lookup:{
                            from:'productattributes',
                            localField:'attributes',
                            foreignField:'_id',
                            as:"attributes",
                            pipeline:[
                                {
                                    $project:{
                                        key:1,
                                        value:1
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    ])
    if(!product) throw new ApiError(404,'Product not found with given id')

    return res.status(200).json({
        message:'Product fetch by id successfully',
        product
    })
})


// Searching & filtering products part

export const searchProduct = asynchandller(async (req, res) => {
    try {
        const query  = req.query.statement
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const skip = (page - 1) * limit;

        const [category, subcategory, brand] = await Promise.all([
            Category.findOne({ name: { $regex: query.trim(), $options: 'i' }, is_subcategory: false }).select('_id'),
            Category.findOne({ name: { $regex: query.trim(), $options: 'i' }, is_subcategory: true }).select('_id'),
            Product.findOne({ brand: { $regex: query.trim(), $options: 'i' } }).select('brand -_id')
        ])
        let filter = {}
        if (category) {
            filter.category = category
        }
        else if (subcategory) {
            filter.subcategory = subcategory
        }
        else if (brand) {
            filter = brand
        }
        else {
            filter.name = { $regex: query.trim(), $options: 'i' }
        }

        const [products,totalproducts] = await Promise.all([
            Product.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).populate('category').select('_id name price discount_price discount images'),
            Product.countDocuments(filter)
        ])

        return res.status(200).json({
            page,
            totalpages: Math.ceil(totalproducts / limit),
            totalproducts,
            products
        })
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error
        })
    }
})

export const getProductByCategory = asynchandller(async (req, res) => {
    try {
        const { categoryId } = req.params

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const skip = (page - 1) * limit;

        const [category, subcategory] = await Promise.all([
            Category.findOne({ _id: categoryId, is_subcategory: false }).select('_id'),
            Category.findOne({ _id: categoryId, is_subcategory: true }).select('_id')
        ])

        let filter = {}

        if (category) {
            filter.category = category
        }
        else if (subcategory) {
            filter.subcategory = subcategory
        }

        const [products,totalproducts] = await Promise.all([
            Product.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).populate('category').select('_id name price discount_price discount images'),
            Product.countDocuments(filter)
        ])

        return res.status(200).json({
            page,
            totalpages: Math.ceil(totalproducts / limit),
            totalproducts,
            products
        })
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error
        })
    }
})


export const homepageProduct = asynchandller(async (req, res) => {
    try {
        const buyerId = req.user.id
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const skip = (page - 1) * limit;

        const [cartCategory, listCategory] = await Promise.all([
            Cart.aggregate([
                {
                    $match: { buyer: new mongoose.Types.ObjectId(buyerId) }
                },
                { $unwind: "$items" },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'items.product',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                { $unwind: '$product' },
                { $group: { _id: '$product.category' } }
            ]),
            Wishlist.aggregate([
                {
                    $match: { buyer: new mongoose.Types.ObjectId(buyerId) }
                },
                { $unwind: "$products" },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'products',
                        foreignField: '_id',
                        as: 'products'
                    }
                },
                { $unwind: '$products' },
                { $group: { _id: '$products.category' } }
            ])
        ])
        const buyerCategories = [...cartCategory, ...listCategory]

        if (buyerCategories.length == 0) {
            const [products,totalproducts] = await Promise.all([
                Product.find({})
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: -1 })
                    .populate('category')
                    .select('_id name price discount_price discount images'),

                Product.countDocuments({})
            ])

            return res.status(200).json({
                page,
                totalpages: Math.ceil(totalproducts / limit),
                totalproducts,
                products
            })
        }

        const [products, totalproducts] = await Promise.all([
            Product.find({ category: { $in: buyerCategories.map((cat) => cat._id) } })
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .populate('category')
                .select('_id name price discount_price discount images'),
            Product.countDocuments({ category: { $in: buyerCategories.map(cat => cat._id) } })
        ])

        return res.status(200).json({
            page,
            totalpages: Math.ceil(totalproducts / limit),
            totalproducts,
            products
        })
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error
        })
    }
})

export const allProducts = asynchandller(async(req,res)=>{
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const skip = (page - 1) * limit;

        const [products, totalproducts] = await Promise.all([
            Product.find({})
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .populate('category')
                .select('_id name price discount_price discount images'),
            Product.countDocuments({})
        ])

        return res.status(200).json({
            page,
            totalpages: Math.ceil(totalproducts / limit),
            totalproducts,
            products
        })

    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error
        })
    }
}) // aa api products page ma and home page ma if user not login tyare use thase  

export const allBrands = asynchandller(async(req,res)=>{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;

    const products = (await Product.find({}).select('-_id brand')).map((b)=>b.brand)
    const allbrands = [...new Set(products)]
    const brands = []
    for(let i=skip;i<skip+limit;i++) {
        brands.push(allbrands[i])
    }
    return res.status(200).json({
        message:'Fetch all brands successfully',
        page,
        brands,
        totalbrands:(allbrands.length-limit*page)
    })
})

export const aiDescription = asynchandller(async(req,res)=>{
    const {name,key,imgurl} = req.body
    if([name,imgurl].some((field)=>field=='')) throw new ApiError(400,'Plz fill all field')

    const aidescription = await getAiDescription(name,imgurl)

    if(!aidescription) throw new ApiError(500,'Some mistake during generating or too many request')
    await destroyoldPic(key)

    return res.status(200).json({
        message:'Description generate successfully',
        description:aidescription
    })
})