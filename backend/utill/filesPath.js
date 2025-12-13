import path from 'path'


export const StoragePath = (sellerName,options={}) =>{
    const {
        includeSellerName = false,
        includeuserprofilepic = true,
        includeproductspic = false
    } = options

    const folderPath = [
        includeuserprofilepic ? "userprofilepic" : null,
        includeproductspic ? "productpic" : null,
        includeSellerName ? sellerName : null
    ].filter(Boolean)

    return path.posix.join(...folderPath)
}