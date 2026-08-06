export class HttpException extends Error {
    message: string;
    errorCode: ErrorCode;
    statusCode: number;
    errors: any;

    constructor (message: string, statusCode: number, errorCode: ErrorCode, errors: any) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.errors = errors;

        Object.setPrototypeOf(this, new.target.prototype); 
        // It manually resets the prototype of the newly created error object to point to your custom class instead of the base Error class. 
        // Extending built-in classes like Error, Array, or Map breaks the prototype chain.
        
        Error.captureStackTrace(this, this.constructor);
        //Cleans up the log output so the stack trace points directly to where the error was thrown in your controller/code.
        //It creates a .stack property on your error object, while stripping out internal constructor calls from the stack trace output.
    }
} 

export const ErrorCode = {
  USER_ALREADY_EXISTS: 101,
  USER_NOT_FOUND: 102,
  INVALID_PASSWORD: 103,
  INTERNAL_EXCEPTION: 104,
  UNPROCESSABLE_ENTITY: 105,
  UNAUTHORIZED: 106,
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];