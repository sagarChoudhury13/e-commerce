import { ErrorCode, HttpException} from "./root.ts";

export class UnprocessableEntity extends HttpException {
    constructor(
        message: string="Validation Failed", errorCode: ErrorCode, errors: any) {
        super(message, 422, errorCode, errors)
    }
}