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
        //console.log("File uploaded to Cloudinary successfully", response.url);
        fs.unlinkSync(localFilePath) // Delete the local file
        return response;
        //delete the file from local storage

    }catch(error){
        fs.unlinkSync(localFilePath) // Delete the local file
        console.error("Error uploading file to Cloudinary", error);
        return null;
    }
}

const deleteFromCloudinary = async (publicIdOrUrl, resourceType = "image") => {
    try {
        if (!publicIdOrUrl) return null;
        let publicId = publicIdOrUrl;
        if (publicIdOrUrl.startsWith("http://") || publicIdOrUrl.startsWith("https://")) {
            const urlParts = publicIdOrUrl.split("/");
            const filenameWithExt = urlParts[urlParts.length - 1];
            publicId = filenameWithExt.split(".")[0];
        }
        const response = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType
        });
        return response;
    } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
        return null;
    }
};

export { uploadOnCloudinary, deleteFromCloudinary };
