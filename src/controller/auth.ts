import type {Response, Request, NextFunction} from "express";
import {prismaClient} from "../index.ts";
import {hashSync, compareSync} from "bcrypt";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../secrets.ts";
import { BadRequestException } from "../exception/bad-request.ts";
import { ErrorCode } from "../exception/root.ts";
import { signUpSchema } from "../schema/users.ts";
import { UnprocessableEntity } from "../exception/validation.ts";
import { NotFoundException } from "../exception/not-found.ts";

export const signUp = async (req:Request , res:Response,  next:NextFunction) => {
    const input = signUpSchema.safeParse(req.body);
    if(!input.success){
        throw new UnprocessableEntity("Invalid input", ErrorCode.UNPROCESSABLE_ENTITY, input.error.issues);
    }
    const {email, password, name} = req.body;

    let user = await prismaClient.users.findFirst({where: {email}});
    if(user){
      throw new BadRequestException("User already exists", ErrorCode.USER_ALREADY_EXISTS);
    }   
    user = await prismaClient.users.create({
        data:{name,
            email,
            password : hashSync(password, 10)
        }
    })
    res.json(user);
}


export const login = async (req:Request , res:Response, next: NextFunction) => {
    const {email, password} = req.body;

    let user = await prismaClient.users.findFirst({where: {email}});
    if(!user){
        throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
    }   
    if(!compareSync(password, user!.password)){
       throw new BadRequestException("Invalid password", ErrorCode.INVALID_PASSWORD);
    }

    const token = jwt.sign({
        userId: user!.id
    },JWT_SECRET)
 
    res.json({user,token});
}