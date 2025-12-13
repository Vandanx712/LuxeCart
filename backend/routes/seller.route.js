import { Router } from "express";
import { assignOrder, deleteAttribute, deleteVariant, deliveryboylist, filterAllList, getAllDeliveryBoy, getFreedeliveryBoy, getOndeliveryBoy, getOrderById, getOrderByStatus, getSellerById, ordergetbyid, orderlist, productDelete, productlist, productUpdate, sellerlogin, sellerRegister, updateAttribute, updateSeller, updateVariant, uploadProduct } from "../controllers/seller.controller.js";
import { verifyjwt } from "../middlewares/verifyjwt.js";
import verifyRoles from '../middlewares/verifyrole.js'



const sellerRouter = Router()


sellerRouter.route('/register').post(sellerRegister)
sellerRouter.route('/login').post(sellerlogin)
sellerRouter.route('/update').put(verifyjwt,verifyRoles(['seller']),updateSeller)
sellerRouter.route('/getdetail/:sellerId').get(verifyjwt,verifyRoles(['seller']),getSellerById)

// deliveryboy part 
sellerRouter.route('/getallboys').get(verifyjwt,verifyRoles(['seller']),getAllDeliveryBoy) // aatran test karvani baki chhe 
sellerRouter.route('/getOndeliveryboy').get(verifyjwt,verifyRoles(['seller']),getOndeliveryBoy)
sellerRouter.route('/getfreedeliveryboy').get(verifyjwt,verifyRoles(['seller']),getFreedeliveryBoy)

//product part 
sellerRouter.route('/uploadproduct').post(verifyjwt,verifyRoles(['seller']),uploadProduct)
sellerRouter.route('/updateproduct').put(verifyjwt,verifyRoles(['seller']),productUpdate)
sellerRouter.route('/deleteproduct/:productId').delete(verifyjwt,verifyRoles(['seller']),productDelete)

//productattribute and variant part
sellerRouter.route('/updateattribute').put(verifyjwt,verifyRoles(['seller']),updateAttribute)
sellerRouter.route('/deleteattribute/:attributeId').delete(verifyjwt,verifyRoles(['seller']),deleteAttribute)
sellerRouter.route('/updatevariant').put(verifyjwt,verifyRoles(['seller']),updateVariant)
sellerRouter.route('/deletevariant/:variantId').delete(verifyjwt,verifyRoles(['seller']),deleteVariant)

// Order part
sellerRouter.route('/getorderbystatus').post(verifyjwt,verifyRoles(['seller']),getOrderByStatus)
// sellerRouter.route('/getorderbyid/:orderId').get(verifyjwt,verifyRoles(['seller','deliveryboy']),getOrderById)
sellerRouter.route('/assignorder').put(verifyjwt,verifyRoles(['seller']),assignOrder)

//Seller dashboard
sellerRouter.route('/getorderlist').get(verifyjwt,verifyRoles(['seller']),orderlist)
sellerRouter.route('/getproductlist').get(verifyjwt,verifyRoles(['seller']),productlist)
sellerRouter.route('/getdeliveryboylist').get(verifyjwt,verifyRoles(['seller']),deliveryboylist)
sellerRouter.route('/getfilteredlist').post(verifyjwt,verifyRoles(['seller']),filterAllList)
sellerRouter.route('/getorderbyid/:orderid').get(verifyjwt,verifyRoles(['seller','deliveryboy']),ordergetbyid)

export default sellerRouter