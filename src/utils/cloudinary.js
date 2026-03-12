import {v2 as cloudinary} from 'cloudinary';
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
        //upload file to cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        //file has been uploaded 
        console.log("File uploaded to Cloudinary successfully", response.url);
        
        return response;
        //delete the file from local storage

    }catch(error){
        fs.unlinkSync(localFilePath) // Delete the local file
        console.error("Error uploading file to Cloudinary", error);
        return null;
    }
}

export {uploadOnCloudinary}
