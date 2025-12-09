

import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

const configureCloudinary = () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    console.log("Cloudinary configured with Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
};


const uploadonCloudinary = (buffer) => {

    return new Promise((resolve, reject) => {
        if (!buffer) {
            return reject(new Error("No buffer provided to upload"));
        }
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            }
        );
        Readable.from(buffer).pipe(uploadStream);
    });
};

const deletefromCloudinary = async (publicId) => {

    try {
        if (!publicId) return null;
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.log("Error deleting from Cloudinary: ", error);
    }
};

export { uploadonCloudinary, deletefromCloudinary, configureCloudinary };