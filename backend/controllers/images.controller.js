import { ApiError } from "../utill/apierror.js"
import { asynchandller } from "../utill/asynchandller.js"
import { StoragePath } from "../utill/filesPath.js"
import { destroyoldPic, updatePic, uploadPic } from "../services/cloudstorage.js"
import { findUserByEmail } from "./common.controller.js"




export const setProfilePic = asynchandller(async (req, res) => {
    const file = req.files
    const user = req.user

    if (!file) throw new ApiError(409, 'Please upload image file')

    const User = await findUserByEmail(user.email)
    const Key = StoragePath('',{})

    const img = await uploadPic(Key,file)

    User.profileImg = img[0]
    await User.save()
    
    return res.status(200).json({
        message: 'Profile image upload successfully',
        profileImg:User.profileImg
    })
})

export const updateProfilePic = asynchandller(async (req, res) => {
    const { oldkey } = req.body
    const file = req.files[0]
    const user = req.user

    if (!file) throw new ApiError(409, 'Please upload image file')
    const User = await findUserByEmail(user.email)
    const Key = StoragePath('',{})
    const updatedImg = await updatePic(oldkey,Key,file)

    User.profileImg = updatedImg
    await User.save()

    return res.status(200).json({
        message: 'Profile image update successfully',
        profileImg:User.profileImg
    })
})

export const getProfilePic = asynchandller(async (req, res) => {
    const user = req.user

    const profilepic = user.profileImg
    return res.status(200).json({
        message: 'Fetch user profile image',
        profilepic
    })
})

// product images 

export const uploadProductimg = asynchandller(async(req,res)=>{
    const files = req.files 
    const seller = req.user 

    if(files.length==0) throw new ApiError(400,'Plz upload product image')

    const key = StoragePath(seller.username,{includeSellerName:true,includeuserprofilepic:false,includeproductspic:true})
    const productimages = await uploadPic(key,files)
    
    return res.status(200).json({
        message:'Product images upload successfully',
        productimages
    })
})

export const deleteSingleimg = asynchandller(async(req,res)=>{
    const { oldkey } = req.body
    await destroyoldPic(oldkey)
    return res.status(200).json({
        message:'Delete Image successfully'
    })
})