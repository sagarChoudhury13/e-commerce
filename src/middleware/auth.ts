import type { Request, Response, NextFunction } from "express";
import { UnauthorizedException } from "../exception/unauthorized.ts";
import { ErrorCode } from "../exception/root.ts";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets.ts";
import { prismaClient } from "../index.ts";

export interface AuthenticatedRequest extends Request {
    user?: any
}

export const authMiddleware = async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    try{
    const authHeader = req.headers.authorization;
    if(!authHeader){
        throw new UnauthorizedException("Unauthorized, No authentication token provided.", ErrorCode.UNAUTHORIZED);
    }
    // verify token 
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;
    const decoded = jwt.verify(token!, JWT_SECRET) as any;
    const user = await prismaClient.users.findUnique({where : {id: decoded.userId }})
    if(!user){
        throw new UnauthorizedException('Unauthorized, No user found', ErrorCode.UNAUTHORIZED)
    }
    req.user = user

    next();

    }catch(err: any){
        throw new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED, err.message)
    }
}