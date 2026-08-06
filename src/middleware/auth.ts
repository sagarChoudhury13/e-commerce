import type { Request, Response, NextFunction } from "express";
import { UnauthorizedException } from "../exception/unauthorized.ts";
import { ErrorCode } from "../exception/root.ts";
import jwt from "jsonwebtoken";

const authMiddleware = async(req: Request, res: Response, next: NextFunction) => {

    const token = req.headers.authorization;
    if(!token){
        throw new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED);
    }

}