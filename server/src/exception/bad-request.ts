import { ErrorCode, HttpException,  } from "./root.ts";

export class BadRequestException extends HttpException {
    constructor(
        message: string = 'Bad Request', 
        errorCode: ErrorCode) {
        super(message, 400, errorCode, null);
    }
}