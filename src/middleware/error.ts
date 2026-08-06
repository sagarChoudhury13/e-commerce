import type { Request, Response, NextFunction } from 'express';
import { HttpException, ErrorCode } from '../exception/root.ts';
import { InternalServerError } from '../exception/internal-exception.ts';

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let exception: HttpException;
  if (err instanceof HttpException) {
    exception = err;
  } else {
    exception = new InternalServerError(
      'An unexpected error occurred',
       ErrorCode.INTERNAL_EXCEPTION,
       err.message
    );
  }

  //Send to frontend
  res.status(exception.statusCode).json({
    success: false,
    message: exception.message,
    errorCode: exception.errorCode,
    error: exception.errors,
  });
};