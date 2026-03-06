import {v2} from 'cloudinary';
import fs  from 'fs';

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        })//finle is uploaded to cloudinary
        console.log("File uploaded to Cloudinary successfully", response.url);
        return response;
    }catch(error){
        fs.unlinkSync(localFilePath) // Delete the local file
        console.error("Error uploading file to Cloudinary", error);
        return null;
    }
}

export {uploadOnCloudinary}
