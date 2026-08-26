import type { Request, Response } from "express"
import {prismaClient} from "../index.ts";
import { productSchema } from "../schema/products.ts";
import { UnprocessableEntity } from "../exception/validation.ts";
import { NotFoundException } from "../exception/not-found.ts";
import { ErrorCode } from "../exception/root.ts";
import type { AuthenticatedRequest } from "../middleware/auth.ts";
import { v2 as cloudinary } from 'cloudinary';
import { extractCloudinaryPublicId } from "../middleware/upload.ts";


export const createProducts = async (req: Request, res: Response) => {
  // 1. Upload the image if it exists in the request
  let imageUrl = null;
  if (req.file) {
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    
    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      folder: 'products',
    });
    imageUrl = uploadResult.secure_url;
  }
  
  const payload = productSchema.safeParse(req.body);
  
  if (!payload.success) {
    throw new UnprocessableEntity(
      "Input Schema Error", 
      ErrorCode.UNPROCESSABLE_ENTITY, 
      payload.error.issues
    );
  }

  
  const product = await prismaClient.products.create({
    data: {
      ...payload.data,
      // If FormData sends tags as a single string "tag1,tag2", you don't need to join.
      // If it sends an array, join it. This handles both cases safely:
      tags: Array.isArray(payload.data.tags) ? payload.data.tags.join(',') : payload.data.tags,
      image_url: imageUrl,
    }
  });

  res.status(201).json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
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
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      
      const uploadResult = await cloudinary.uploader.upload(dataURI, {
        folder: 'products',
      });
      
      updatedData.image_url = uploadResult.secure_url;

      // 4. Delete the OLD image from Cloudinary to free up storage
      if (existingProduct.image_url) {
        const publicId = extractCloudinaryPublicId(existingProduct.image_url);
        await cloudinary.uploader.destroy(publicId);
      }
    }

    // 5. Update the database
    const updatedProduct = await prismaClient.products.update({
      where: { id: productId },
      data: updatedData,
    });
    
    res.json(updatedProduct);

  } catch (err: any) {
    // Make sure you don't swallow Prisma validation errors here
    res.status(500).json({ error: "Failed to update product" });
  }
};

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
            take: 5
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