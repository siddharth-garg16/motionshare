import {v2 as cloudinary, UploadApiResponse} from 'cloudinary';
import fs from 'fs';

const uploadOnCloudinary = async(localFilePath: string) => {
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    try{
        if(!localFilePath) return null
        const uploadResponse = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })
        console.log('File uploaded!', uploadResponse.url);
        fs.unlinkSync(localFilePath);
        return uploadResponse
    }catch(error){
        console.log('file upload error!', error)
        fs.unlinkSync(localFilePath);
        return null
    }
}

export {uploadOnCloudinary}