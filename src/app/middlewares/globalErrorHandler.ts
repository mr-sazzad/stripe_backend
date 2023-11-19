import { Request, Response } from 'express';
import { ZodError } from 'zod';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import handleCastError from '../../errors/HandleCastError';
import handleValidationError from '../../errors/HandleValidationError';
import handleZodError from '../../errors/HandleZodError';
import { IGenericErrorResponse } from '../../interfaces/common';
import { IGenericErrorMessage } from '../../interfaces/error';

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key: any, value: object | null) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular]';
      }
      seen.add(value);
    }
    return value;
  };
};

const handleDuplicateEntryError = (error: any) => ({
  message: 'Duplicate Entry',
  errorMessages: [
    {
      path: '',
      message: error.errmsg || error.message,
    },
  ],
  stack: error.stack,
});

const globalErrorHandler = (error: any, req: Request, res: Response) => {
  // if (config.env === 'development') {
  //   console.log(
  //     'globalErrorHandler ~~~',
  //     JSON.stringify(error, getCircularReplacer())
  //   );
  // } else {
  //   console.log(
  //     'globalErrorHandler ~~',
  //     JSON.stringify(error, getCircularReplacer())
  //   );
  // }

  let statusCode = 500;
  let message = 'Something went wrong!';
  let errorMessages: IGenericErrorMessage[] = [];
  let stack: string | undefined;

  if (error?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
    stack = error.stack;
  } else if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
    stack = error.stack;
  } else if (error?.name === 'CastError') {
    const simplifiedError = handleCastError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
    stack = error.stack;
  } else if (error?.code === 11000) {
    const duplicateEntryError = handleDuplicateEntryError(error);
    statusCode = 409;
    message = duplicateEntryError.message;
    errorMessages = duplicateEntryError.errorMessages;
    stack = duplicateEntryError.stack;
  } else if (error instanceof ApiError) {
    statusCode = error?.statusCode;
    message = error?.message;
    errorMessages = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : [];
    stack = error.stack;
  } else if (error instanceof Error) {
    message = error?.message;
    errorMessages = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : [];
  }

  const errorResponse: IGenericErrorResponse = {
    statusCode,
    success: false,
    message,
    errorType: error?.name || 'Error Type',
    errorMessages,
    stack,
  };

  res.status(statusCode).json(errorResponse);
};

export default globalErrorHandler;
