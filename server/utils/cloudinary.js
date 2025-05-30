import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      console.error('❌ File not found:', filePath);
      throw new Error('File does not exist');
    }

    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'auto'
    });

    // Remove file after upload
    fs.unlinkSync(filePath);
    return result;
  } catch (err) {
    console.error('❌ Cloudinary upload error:', err);
    throw new Error('Cloudinary upload failed');
  }
};

export default uploadToCloudinary;
