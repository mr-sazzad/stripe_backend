import { IGenericErrorMessage } from '../interfaces/error';

class ApiError extends Error {
  statusCode: number;
  success: boolean;
  errorType: string;
  errorMessages: IGenericErrorMessage[];

  constructor(statusCode: number, message: string | undefined, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.errorType = '';
    this.errorMessages = [];
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
