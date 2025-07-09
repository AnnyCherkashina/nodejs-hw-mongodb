import { v2 as cloudinary } from 'cloudinary';
import { getEnvVar } from './getEnvVar.js';

cloudinary.config({
    cloud_name: getEnvVar('CLOUDINARY_NAME'),
    api_key: getEnvVar('CLOUDINARY_API_KEY'),
    api_secret: getEnvVar('CLOUDINARY_API_SECRET'),
});

export const uploadToCloudinary = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'contacts',
        });
        return result;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload file to Cloudinary');
    }
};
