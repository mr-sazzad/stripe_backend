import { ZodError, ZodIssue } from 'zod';
import { IGenericErrorResponse } from '../interfaces/common';
import { IGenericErrorMessage } from '../interfaces/error';

const handleZodError = (error: ZodError): IGenericErrorResponse => {
  const errors: IGenericErrorMessage[] = error.issues.map((issue: ZodIssue) => {
    return {
      path: issue.path[issue.path.length - 1] || '',
      message: issue.message || '',
    };
  });

  const statusCode = 400;
  return {
    success: false,
    statusCode,
    message: 'Validation Error',
    errorType: 'Validation Error',
    errorMessages: errors,
    stack: error.stack,
  };
};

export default handleZodError;
