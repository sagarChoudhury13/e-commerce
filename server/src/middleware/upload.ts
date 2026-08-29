import multer from 'multer';

// Configure Multer to use memory storage
const storage = multer.memoryStorage();
export const upload = multer({ storage });


export const extractCloudinaryPublicId = (url: string) => {
  // Example URL: https://res.cloudinary.com/demo/image/upload/v1312461204/products/sample.jpg
  const splitUrl = url.split('/');
  const folder = splitUrl[splitUrl.length - 2];
  const fileWithExtension = splitUrl[splitUrl.length - 1];
  const fileName = fileWithExtension!.split('.')[0];
  
  return `${folder}/${fileName}`; // e.g., "products/sample"
};