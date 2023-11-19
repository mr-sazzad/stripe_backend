import mongoose from 'mongoose';
import { IGenericErrorMessage } from '../interfaces/error';
import { IGenericErrorResponse } from '../interfaces/common';

const handleCastError = (
  error: mongoose.Error.CastError
): IGenericErrorResponse => {
  const errors: IGenericErrorMessage[] = [
    {
      path: error?.path || '',
      message: error?.message || '',
    },
  ];
  const statusCode = 400;
  return {
    success: false,
    statusCode,
    message: 'Cast Error',
    errorType: 'Cast Error',
    errorMessages: errors,
    stack: error?.stack,
  };
};

export default handleCastError;
