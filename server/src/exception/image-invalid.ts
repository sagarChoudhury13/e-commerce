import { HttpException, ErrorCode } from "./root.ts";

 export class ImageFileInvalid extends HttpException {
    constructor(
        message: string="Unauthorized",
        errorCode: ErrorCode,
        errors?: any) {
        super(message, 401, errorCode, errors);
    }
}