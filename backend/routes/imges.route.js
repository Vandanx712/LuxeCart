import { Router } from "express";
import { verifyjwt } from "../middlewares/verifyjwt.js";
import upload from "../middlewares/multer.js";
import { deleteSingleimg, getProfilePic, setProfilePic, updateProfilePic, uploadProductimg } from "../controllers/images.controller.js";
import verifyRoles from "../middlewares/verifyrole.js";

const imagesRouter = Router()


imagesRouter.route('/set').post(verifyjwt,upload.any(),setProfilePic)
imagesRouter.route('/update').post(verifyjwt,upload.any(),updateProfilePic)
imagesRouter.route('/get').get(verifyjwt,getProfilePic)
imagesRouter.route('/uploadimages').post(verifyjwt,verifyRoles(['seller']),upload.any(),uploadProductimg)
imagesRouter.route('/delete').put(verifyjwt,verifyRoles(['seller']),deleteSingleimg)


export default imagesRouter 