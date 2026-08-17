import { HttpException, ErrorCode } from "./root.ts";
    
export class InternalServerError extends HttpException {
    constructor(
        message: string = "Internal Server Error",
        errorCode: ErrorCode,
        errors: any) {
        super(message, 500, errorCode, errors);
    }
}