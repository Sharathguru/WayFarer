import multer from "multer"
import {v2 as cloudinary} from "cloudinary";
import {CloudinaryStorage} from "multer-storage-cloudinary";
import dotenv from "dotenv";
dotenv.config();


// Configuration
cloudinary.config({ 
    cloud_name: process.env.cloud_name, 
    api_key: process.env.api_key, 
    api_secret: process.env.api_secret 
});

const storage=new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:"travel-users",
        allowed_formats:["jpg","png","jpeg"],
        transformation:[{width:500,height:500,quality:"auto",crop:"scale"}],
    },
    size: 1024*1024*5
})

let upload =multer({storage:storage})

export default upload