
import { HttpException, ErrorCode } from "./root.ts";

 export class UnauthorizedException extends HttpException {
    constructor(
        message: string="Unauthorized",
        errorCode: ErrorCode,
        errors?: any) {
        super(message, 401, errorCode, errors);
    }
}