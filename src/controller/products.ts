import type { Request, Response } from "express"
import {prismaClient} from "../index.ts";
import { productSchema } from "../schema/products.ts";
import { UnprocessableEntity } from "../exception/validation.ts";
import { NotFoundException } from "../exception/not-found.ts";
import { ErrorCode } from "../exception/root.ts";


export const createProducts = async(req: Request, res:Response) => {

    let payload = productSchema.safeParse(req.body);
    if(!payload.success){
        throw new UnprocessableEntity("Input Schema Error", ErrorCode.UNPROCESSABLE_ENTITY, payload.error.issues)
    }
        
    const product = await prismaClient.products.create({
        data:{
            ...req.body,
            tags: req.body.tags.join(',')
        }
    })
    res.json(product);

}

export const updateProduct = async(req: Request, res: Response) =>{
    try{
        const product = req.body;
        if(product.tags){
            product.tags = product.tags.join(",")
        }
        const updatedProduct = await prismaClient.products.update({where: {id: Number(req.params.id)}, data: product })
        res.json(updatedProduct);

    }catch(err:any){
        throw new NotFoundException("Product Unavailable",ErrorCode.PRODUCT_NOT_FOUND)
    }
}

export const deleteProduct = async(req:Request, res:Response) => {
    try{
        const deletedProduct = await prismaClient.products.delete({where: {id: Number(req.params.id)}});
        res.json(deletedProduct);

    }catch(err:any){
        throw new NotFoundException("Product Unavailable",ErrorCode.PRODUCT_NOT_FOUND)
    }
}

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