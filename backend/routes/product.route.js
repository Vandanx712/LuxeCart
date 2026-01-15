import { Router } from "express";
import { verifyjwt } from "../middlewares/verifyjwt.js";
import {aiDescription, allBrands, allProducts, attributegetById, getallCategory, getCategoryAndSubcategory, getCategoryById, getProductByCategory, getSubcategoryByCategory, homepageProduct, productGetById, searchProduct, variantgetById } from "../controllers/product.controller.js";
import verifyRoles from "../middlewares/verifyrole.js";


const productRouter = Router()

//category
productRouter.route('/category/:categoryId').get(getCategoryById)
productRouter.route('/allcategory').get(getallCategory)
productRouter.route('/getsubcategory/:categoryId').get(getSubcategoryByCategory)
productRouter.route('/allcategoyandsubcategory').get(getCategoryAndSubcategory) // public api for buyer

//attribute
productRouter.route('/getattribute/:attributeId').get(verifyjwt,verifyRoles(['seller']),attributegetById)
productRouter.route('/getvariant/:variantId').get(verifyjwt,verifyRoles(['seller']),variantgetById)

//product
productRouter.route('/getproductById/:productId').get(productGetById)
productRouter.route('/search').post(searchProduct)
productRouter.route('/searchby/:categoryId').get(getProductByCategory)
productRouter.route('/homepage').get(verifyjwt,homepageProduct)
productRouter.route('/allproducts').get(allProducts)
productRouter.route('/allbrand').get(allBrands)
productRouter.route('/getaides').post(verifyjwt,verifyRoles(['seller']),aiDescription)

export default productRouter