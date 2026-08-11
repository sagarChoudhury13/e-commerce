import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.ts";
import { cartSchema, changeQuantitySchema } from "../schema/cart.ts";
import { UnprocessableEntity } from "../exception/validation.ts";
import { ErrorCode } from "../exception/root.ts";
import { prismaClient } from "../index.ts";
import { NotFoundException } from "../exception/not-found.ts";
import type { products } from "../../generated/prisma/browser.ts";



export const addItemToCart = async(req:AuthenticatedRequest, res:Response)=>{
    const validateData = cartSchema.safeParse(req.body);
    if(!validateData.success){
        throw new UnprocessableEntity("Inputs missing", ErrorCode.UNPROCESSABLE_ENTITY, validateData.error.issues);
    }

    let product: products;

    try{
        product = await prismaClient.products.findFirstOrThrow({
            where: {
                id : validateData.data.productId
            }
        })
    }catch(err){
        throw new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND);
    }

    const cartItems = await prismaClient.cart.findFirst({
        where: {
            productId: product.id,
            userId: req.user.id
        }
    })

    if(cartItems){
        const updatedCart = await prismaClient.cart.update({
            where: {
                id: cartItems.id
            },
            data: {
                quantity: {
          increment: validateData.data.quantity,
        },
            },
        });
        return res.json(updatedCart)
    }

    const newCartItem = await prismaClient.cart.create({
        data:{
            userId : req.user.id,
            productId: product.id,
            quantity: validateData.data.quantity
        }
    })
    res.json(newCartItem);
    }



export const deleteCart = async(req:AuthenticatedRequest, res: Response)=>{

    try{
   await prismaClient.cart.deleteMany({
  where: {
    id: Number(req.params.id),
    userId: req.user.id,
  },
});
    res.json({success : true});
}catch(err){
    throw new NotFoundException("Product not found in cart", ErrorCode.PRODUCT_NOT_FOUND)
}
}

export const changeQuantity = async(req: AuthenticatedRequest, res: Response)=>{

    const validateData = changeQuantitySchema.safeParse(req.body);
    if(!validateData.success){
        throw new UnprocessableEntity("Quantity missing", ErrorCode.UNPROCESSABLE_ENTITY, validateData.error.issues);
    }

    const updatedData = await prismaClient.cart.updateMany({
        where: {
            id: Number(req.params.id),
            userId: req.user.id
        },
        data: {quantity: validateData.data.quantity}
    })
    res.json(updatedData)

}


export const getCart = async(req: AuthenticatedRequest, res: Response)=>{
    const cart = await prismaClient.cart.findUnique({
        where: {
            id: Number(req.params.id)
        },
        include: {
            products: true
        }
    })
    
    res.json(cart);
} 