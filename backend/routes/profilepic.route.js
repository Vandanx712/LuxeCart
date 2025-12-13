import { Router } from "express";
import { verifyjwt } from "../middlewares/verifyjwt.js";
import upload from "../middlewares/multer.js";
import { getProfilePic, setProfilePic, updateProfilePic } from "../controllers/profilepic.controller.js";


const profilepicRouter = Router()


profilepicRouter.route('/set').post(verifyjwt,upload.any(),setProfilePic)
profilepicRouter.route('/update').post(verifyjwt,upload.any(),updateProfilePic)
profilepicRouter.route('/get').get(verifyjwt,getProfilePic)


export default profilepicRouter 