import type { Request, Response, NextFunction } from "express"
import {prismaClient} from "../index.ts";
import { productSchema } from "../schema/products.ts";
import { UnprocessableEntity } from "../exception/validation.ts";
import { NotFoundException } from "../exception/not-found.ts";
import { ErrorCode } from "../exception/root.ts";
import type { AuthenticatedRequest } from "../middleware/auth.ts";
import cloudinary from '../config/cloudinary.ts';
import { extractCloudinaryPublicId } from "../middleware/upload.ts";
import streamifier from "streamifier";
import { ImageFileInvalid } from "../exception/image-invalid.ts";



export const createProduct = async (req: Request, res: Response, next: NextFunction) => {

  const response = productSchema.safeParse(req.body);
  if(!response.success){
    throw new UnprocessableEntity("req validate fail", ErrorCode.UNPROCESSABLE_ENTITY, response.error.issues);
  }
  try {
    const { name, price, description, tags } = req.body;
    
    // 1. Ensure a file was actually uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Product image is required" });
    }

    // 2. Upload the file buffer to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "ecommerce_products" }, // Organizes images in your Cloudinary dashboard
      async (error, result) => {
        if (error) return next(error);
        if (!result) return res.status(500).json({ message: "Upload failed" });

        // 3. Save the product with the Cloudinary URL to the database
        const newProduct = await prismaClient.products.create({
          data: {
            name,
            price: Number(price),
            tags,
            description,
            image_url: result.secure_url, 
          }
        });

        return res.status(201).json(newProduct);
      }
    );

    // Pipe the memory buffer into the Cloudinary upload stream
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);

  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next:NextFunction) => {
  try {
    const productId = Number(req.params.id);
    let updatedData = { ...req.body };

    // 1. Fetch the existing product to check if it has an old image
    const existingProduct = await prismaClient.products.findUnique({
      where: { id: productId }
    });

    if (!existingProduct) {
      throw new NotFoundException("Product Unavailable", ErrorCode.PRODUCT_NOT_FOUND);
    }

    // 2. Handle tags (FormData strings or arrays)
    if (updatedData.tags) {
      updatedData.tags = Array.isArray(updatedData.tags) 
        ? updatedData.tags.join(",") 
        : updatedData.tags;
    }

    // If price is sent via FormData as a string, make sure it's parsed back to a number
    if (updatedData.price) {
      updatedData.price = parseFloat(updatedData.price);
    }

    // 3. Handle new image upload if one was provided
    if (req.file) {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "ecommerce_products" },
        async (error, result) => {
          if (error) throw (error);
          if (!result) return res.status(500).json({ message: "Upload failed" });

          // Attach the new Cloudinary URL to the update payload
          updatedData.image_url = result.secure_url;

          // Save to the database after the Cloudinary upload finishes
          const updatedProduct = await prismaClient.products.update({
            where: { id: Number(productId) },
            data: updatedData,
          });
      res.json(updatedProduct);
  })
};
}catch(err){
  throw new ImageFileInvalid("Image file/url invalid", ErrorCode.IMAGE_FILE_INVALID, err);
}
}

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.id);

    // 1. Find the product first so we can get its image_url
    const product = await prismaClient.products.findUnique({
      where: { id: productId }
    });

    if (!product) {
        throw new NotFoundException("Product Unavailable", ErrorCode.PRODUCT_NOT_FOUND);
    }

    // 2. Delete the product from the PostgreSQL database
    const deletedProduct = await prismaClient.products.delete({
      where: { id: productId }
    });

    // 3. Delete the image from Cloudinary
    if (product.image_url) {
      const publicId = extractCloudinaryPublicId(product.image_url);
      await cloudinary.uploader.destroy(publicId);
    }

    res.json({ message: "Product deleted successfully", deletedProduct });

  } catch (err: any) {
    res.status(500).json({ error: "Failed to delete product" });
  }
};

export const listProducts = async(req:Request, res:Response)=>{

        const count = await prismaClient.products.count();
        const products = await prismaClient.products.findMany({
            skip : Number(req.query.skip || 0),
            take: 6
        })
        res.json({count, data: products});
    
}

export const getProductById = async(req:Request, res:Response) =>{
    try{
        const productId = Number(req.params.id);
        const product = await prismaClient.products.findFirstOrThrow({where: {id : productId }})
        res.json(product);
    }
    catch(err:any){
        throw new NotFoundException("Product Unavailable",ErrorCode.PRODUCT_NOT_FOUND);
    }
}


export const searchItem = async(req: AuthenticatedRequest, res: Response) =>{
    let searchItem = req.query.q?.toString().trim();

    if (!searchItem) {
    return res.json([]);
  }

    const retrievedProducts = await prismaClient.products.findMany({
        where: {
      OR: [
        { name: { contains: searchItem, mode: 'insensitive' } },
        { description: { contains: searchItem, mode: 'insensitive' } },
        { tags: { contains: searchItem, mode: 'insensitive' } },
      ],
    },
        skip: Number(req.query.skip) || 0,
        take: 5
    })
    res.json(retrievedProducts)
}