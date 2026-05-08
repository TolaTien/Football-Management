import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

export const errorHandlingMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (!err.statusCode) {
    err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }

  const responseError = {
    statusCode: err.statusCode,
    message: err.message || 'Lỗi server',
    stack: err.stack,
  };

  if (process.env.NODE_ENV !== 'dev') {
    delete responseError.stack;

    if (responseError.statusCode === StatusCodes.INTERNAL_SERVER_ERROR) {
      responseError.message = 'Lỗi server';
    }
  }

  if (process.env.NODE_ENV == 'dev') {
    console.error('ERROR LOG:', responseError);
  }

  res.status(responseError.statusCode).json(responseError);
};
