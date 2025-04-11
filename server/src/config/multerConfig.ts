import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinaryConfig'; // Your config file
import multer from 'multer';

const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: 'productImages',
    resource_type: 'auto', // auto-detect image/video/etc
    format: undefined, // Let Cloudinary decide
  }),
});

const upload = multer({ storage });

export default upload;
