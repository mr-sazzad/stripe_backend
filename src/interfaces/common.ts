import { IGenericErrorMessage } from './error';

export type IGenericResponse<T> = {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: T;
};

export type IGenericErrorResponse = {
  success: false;
  statusCode: number;
  message: string;
  errorType: string;
  errorMessages: IGenericErrorMessage[];
  stack?: string;
};
