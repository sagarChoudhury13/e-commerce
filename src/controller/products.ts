import type { Request, Response } from "express"
import {prismaClient} from "../index.ts";
import { productSchema } from "../schema/products.ts";
import { UnprocessableEntity } from "../exception/validation.ts";
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