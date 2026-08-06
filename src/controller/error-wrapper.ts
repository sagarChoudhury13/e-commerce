import type { Request, Response, NextFunction } from "express";

type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;
export const errorHandler = (method: AsyncController) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await method(req, res, next);
    } catch (error) {
      // Passes the error to Express's global error middleware
      next(error);
    }
  };
};