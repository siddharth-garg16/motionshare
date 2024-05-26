import {v2 as cloudinary, UploadApiResponse} from 'cloudinary';
import fs from 'fs';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
});

const uploadOnCloudinary = async(localFilePath: string) => {
    try{
        if(!localFilePath) return null
        const uploadResponse = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })
        console.log('File uploaded!', uploadResponse.url);
        return uploadResponse
    }catch(error){
        fs.unlinkSync(localFilePath);
        return null
    }
}

export {uploadOnCloudinary}