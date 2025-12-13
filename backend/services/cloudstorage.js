import dotenv from 'dotenv'
import {v2 as cloudinary} from 'cloudinary'
import {Readable} from 'stream'
// import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import sharp from "sharp";


dotenv.config()

// for Aws cloud

// const bucketname = process.env.BUCKET_NAME || backet.vandan
// const bucketregion = process.env.BUCKET_REGION
// const accesskey = process.env.ACCESS_KEY
// const secretaccesskey = process.env.SECRET_ACCESS_KEY
// const s3 = new S3Client({
//     credentials: {
//         accessKeyId: accesskey,
//         secretAccessKey: secretaccesskey
//     },
//     region: bucketregion,
// })

// export const uploadPic = async (key, files) => {
//     const image = await Promise.all(
//         files.map((file) => {
//             const imageKey = `${key}/${file.originalname}`
//             const command = new PutObjectCommand({
//                 Bucket: bucketname,
//                 Key: imageKey,
//                 Body: file.buffer,
//                 ContentType: filepath.mimetype
//             })
//             s3.send(command)
//             const getcommand = new GetObjectCommand({
//                 Bucket: bucketname,
//                 Key: imageKey,
//             }) // ahi url e public bucket no aavse  same  updatePic ma aavse 
//             return { imageKey, url }
//         })
//     )
//     // const url = await getSignedUrl(s3, getcommand)
//     return image
// }

// export const updatePic = async (Key, files) => {
//     const oldkey = `userprofilepic/${Key}`
//     const deletecommand = new DeleteObjectCommand({
//         Bucket: bucketname,
//         Key: oldkey,
//     })
//     await s3.send(deletecommand)

//     const imgkey = `userprofilepic/${files.filename}`
//     const command = new PutObjectCommand({
//         Bucket: bucketname,
//         Key: imgkey,
//         Body: Filebuffer,
//         ContentType: filepath.mimetype
//     })
//     await s3.send(command)
//     const key = filepath.filename
//     return { key, url }
// }

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})


export const uploadPic = async(KEY,files)=>{
    try {
        const uploadSingle = (file)=>{
            return new Promise((resolve,reject)=>{
                const strem = cloudinary.uploader.upload_stream({folder:KEY,resource_type:'image'},(error,result)=>{
                    if(error) return reject(error)
                    resolve({key:result.public_id,url:result.secure_url})
                })
                Readable.from(file.buffer).pipe(strem)
            })
        }
        return await Promise.all(files.map(uploadSingle))

    } catch (error) {
        console.error(error)
    }
}

export const updatePic = async(oldkey,key,file)=>{
    try {
        const update=()=>{
            return new Promise((reslove,reject)=>{
                const strem = cloudinary.uploader.upload_stream({folder:key,resource_type:'image'},(error,result)=>{
                    if(error) return reject(error)
                        reslove({key:result.public_id,url:result.secure_url})
                })
                Readable.from(file.buffer).pipe(strem)
            })
        }
        const updateimg = await update()
        await cloudinary.uploader.destroy(oldkey)
        return updateimg
    } catch (error) {
        console.error(error)
    }
}