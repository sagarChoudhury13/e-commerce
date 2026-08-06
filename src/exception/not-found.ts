import {HttpException, ErrorCode} from "./root.ts";



export class NotFoundException extends HttpException {
    constructor(
        message: string = "Resource Not Found",
        errorCode: ErrorCode,
        errors?: any) {
        super(message, 404, errorCode, errors);
    }
}