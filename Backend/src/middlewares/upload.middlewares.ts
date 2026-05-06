import multer  from 'multer';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { 
    fileSize: 50 * 1024 * 1024
  }
});

export default upload;