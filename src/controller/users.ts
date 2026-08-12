import {prismaClient} from "../index.ts";
import { NotFoundException } from "../exception/not-found.ts";
import { ErrorCode } from "../exception/root.ts";
import { UnprocessableEntity } from "../exception/validation.ts";
import type { AuthenticatedRequest } from "../middleware/auth.ts";
import type { Response } from "express";
import { addressSchema, changeRoleSchema, updateUserSchema } from "../schema/users.ts";
import type { address } from "../../generated/prisma/browser.ts";
import { BadRequestException } from "../exception/bad-request.ts";


export const createAddress = async(req:AuthenticatedRequest, res:Response)=>{

    const validate = addressSchema.safeParse(req.body);
    if(!validate.success){throw new UnprocessableEntity("Invalid Address Request", ErrorCode.UNPROCESSABLE_ENTITY, validate.error.issues)};
    try{
        const address = await prismaClient.address.create({
            data: {
                ...req.body,
                userId : req.user.id
            }
        })
        res.json(address);

    }catch{
        throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
    }
} 

export const deleteAddress = async (req: AuthenticatedRequest, res:Response)=>{

    try{
        const deletedAddress = await prismaClient.address.delete({where: {id: Number(req.params.id)}});
        res.json(deletedAddress);
    }catch(err:any){
        throw new NotFoundException('user not found', ErrorCode.USER_NOT_FOUND);
    }

}

export const listAddress = async(req: AuthenticatedRequest, res: Response)=>{

    try{
    const addresses = await prismaClient.address.findMany({where: {userId: req.user.id}});
    res.json(addresses);
    }catch(err:any){
        throw new NotFoundException('user not found', ErrorCode.USER_NOT_FOUND);
    }
    
}


export const updateUser = async(req:AuthenticatedRequest, res: Response)=>{

        const validate = updateUserSchema.safeParse(req.body);
        if(!validate.success){
            throw new UnprocessableEntity("no address found", ErrorCode.UNPROCESSABLE_ENTITY, validate.error.issues);
        }
        let shippingAddress : address;
        let billingAddress : address;
        if(validate.data.defaultShippingAddress){
        try{
            shippingAddress = await prismaClient.address.findFirstOrThrow({
            where: {
                id: validate.data?.defaultShippingAddress!
            }
        })
        }catch(err:any){
            throw new NotFoundException("Address not found", ErrorCode.ADDRESS_NOT_FOUND);
        }
        if(shippingAddress.userId != req.user.id){
            throw new BadRequestException("Address does not belong to user", ErrorCode.ADDRESS_DOES_NOT_BELONG);
        }
    }


    if(validate.data.defaultBillingAddress){
        try{
            billingAddress = await prismaClient.address.findFirstOrThrow({
            where: {
                id: validate.data?.defaultBillingAddress!
            }
        })
       
        }catch(err:any){
            throw new NotFoundException("Address not found", ErrorCode.ADDRESS_NOT_FOUND);
        }
         if(billingAddress.userId != req.user.id){
            throw new BadRequestException("Address does not belong to user", ErrorCode.ADDRESS_DOES_NOT_BELONG);
        }
    }


    const updateUser = await prismaClient.users.update({
        where: {
            id: req.user.id
        },
        data: validate.data
    })

    res.json(updateUser);
}

export const listUsers = async(req: AuthenticatedRequest, res: Response)=> {
    const users = await prismaClient.users.findMany({
        skip : Number(req.query.skip) || 0,
        take: 10
    })
    res.json(users);
}

export const getUserById = async(req:AuthenticatedRequest, res:Response)=>{
    try{
        const user = await prismaClient.users.findFirstOrThrow(
            {
                where: {
                    id: Number(req.params.id)
                },
                include: {
                    address: true
                }
            }
        )
    }catch(err:any){
        throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND)
    }
}

export const changeUserRole = async(req:AuthenticatedRequest, res:Response)=>{

    const validateData = changeRoleSchema.safeParse(req.body);
    if(!validateData.success){
        throw new UnprocessableEntity("Input Invalid", ErrorCode.UNPROCESSABLE_ENTITY, validateData.error.issues)
    } 
    try{
        const user = await prismaClient.users.update(
            {
                where: {
                    id: Number(req.params.id)
                },
                data: {
                    role: req.body
                }
            }
        )
    }catch(err:any){
        throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND)
    }
}
