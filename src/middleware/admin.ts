import type { Request, Response, NextFunction } from "express";
import { UnauthorizedException } from "../exception/unauthorized.ts";
import { ErrorCode } from "../exception/root.ts";

export interface AuthenticatedRequest extends Request {
    user?: any
}

const adminMiddleware = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
       const user = await req.user;
       if(user.role == "ADMIN"){
        next();
       }else{
        throw new UnauthorizedException(
            "Unauthorized",
            ErrorCode.UNAUTHORIZED,
            "Unauthorized, ADMIN role needed")
       }
  
    }

export default adminMiddleware;