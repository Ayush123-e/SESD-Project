import multer from 'multer';
import { storage } from '../config/cloudinary';

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only native image files are allowed!'));
  }
};

export const upload = multer({ 
  storage: storage as any,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

export default upload;
