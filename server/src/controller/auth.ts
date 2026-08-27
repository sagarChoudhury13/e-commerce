import type {Response, Request, NextFunction} from "express";
import type { AuthenticatedRequest } from "../middleware/auth.ts";
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

    const token = jwt.sign({
        userId: user!.id
    },JWT_SECRET,{ expiresIn: "7d" } )


    res.status(201).json({
      message: "Account created successfully",
      token: token,
      user: { id: user.id, name: user.name, email: user.email }
    })
}


export const login = async (req:Request , res:Response, next: NextFunction) => {
    const {email, password} = req.body;

    let user = await prismaClient.users.findUnique({where: {email}});
    if(!user){
        throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
    }   
    if(!compareSync(password, user!.password)){
       throw new BadRequestException("Invalid password", ErrorCode.INVALID_PASSWORD);
    }

    const token = jwt.sign({
        userId: user!.id
    },JWT_SECRET, { expiresIn: "7d" })
 
    res.json({ 
  message: "Login successful", 
  token: token, 
  user: { id: user.id, email: user.email, name: user.name } 
});
}



export const me = async (req: AuthenticatedRequest, res: Response , next: NextFunction) => {
    
    res.json(req.user)
}