import { Router } from "express";
import { createDeliveryBoy } from "../controllers/seller.controller.js";
import { verifyjwt } from "../middlewares/verifyjwt.js";
import verifyRoles from "../middlewares/verifyrole.js";
import { getDeliveryboyById, getOrderByStatus, getOrders, updateBoyProfile, updateOrderstatus } from "../controllers/deliveryBoy.controller.js";


const deliveryBoyRouter = Router()

deliveryBoyRouter.route('/register').post(verifyjwt,verifyRoles(['seller']),createDeliveryBoy)
deliveryBoyRouter.route('/:deliveryboyId').get(verifyjwt,verifyRoles(['deliveryboy']),getDeliveryboyById)
deliveryBoyRouter.route('/updateprofile').put(verifyjwt,verifyRoles(['deliveryboy']),updateBoyProfile)

// order part
deliveryBoyRouter.route('/getorderbystatus').post(verifyjwt,verifyRoles(['deliveryboy']),getOrderByStatus)
deliveryBoyRouter.route('/updatestatus/:orderId').put(verifyjwt,verifyRoles(['deliveryboy']),updateOrderstatus)

//dashboard part
deliveryBoyRouter.route('/dashboard/orders').get(verifyjwt,verifyRoles(['deliveryboy']),getOrders)

export default deliveryBoyRouter