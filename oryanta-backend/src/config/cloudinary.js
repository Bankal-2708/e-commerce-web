import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

 const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  throw new Error('Missing Cloudinary environment variables');
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

// keep uploaded img in ram 
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, and WEBP images are allowed'), false);
    }
  },
});

// upload img on claud
export const uploadToCloudinary = (buffer, folder = 'oryanta/products') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [{ width: 1000, height: 1000, crop: 'limit', quality: 'auto' }],
      },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
  });
};

// upload to claud and return img url 
export const uploadMultipleToCloudinary = (files, folder = 'oryanta/products') => {
  return Promise.all(files.map(file => uploadToCloudinary(file.buffer, folder)));
};

// if delet remove from claud
export const deleteFromCloudinary = (publicId) => {
  return cloudinary.uploader.destroy(publicId);
};

export default cloudinary;