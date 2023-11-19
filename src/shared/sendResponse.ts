import { Response } from 'express';

// type IApiResponse<T> = {
//   statusCode: number;
//   success: boolean;
//   message?: string | null;
//   meta?: {
//     page?: number;
//     limit?: number;
//   } | null;
//   data?: T | null | undefined;
//   stack?: string | undefined;
// };

// const sendResponse = <T>(
//   res: Response,
//   data: IApiResponse<T>,
//   page?: number,
//   limit?: number
// ): void => {
//   const responseData: IApiResponse<T> = {
//     statusCode: data.statusCode,
//     success: data.success,
//     message: data.success ? data.message || null : 'Request failed',
//     meta: page && limit ? { page, limit } : null,
//     data: data.data || null,
//     stack: data.stack,
//   };

//   res.status(data.statusCode).json(responseData);
// };

// export default sendResponse;


interface IResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  data?: unknown;
  clientSecret?: string | null | { clientSecret: string | null };
  payment?: {
    price: number;
    name: string;
    transactionId: string;
  };
}

const sendResponse = <T>(
  res: Response,
  data: {
    statusCode: number;
    success: boolean;
    message?: string;
    meta?: {
      page: number;
      limit: number;
      total: number;
    };
    data?: T | null;
    clientSecret?: string | null | { clientSecret: string | null };
    payment?: {
      price: number;
      name: string;
      transactionId: string;
    };
  }
) => {
  const response: IResponse = {
    success: data.success,
    statusCode: data.statusCode,
    message: data.message || 'Success',
    meta: data.meta,
    data: data.data || null,
    payment: data.payment,
    clientSecret: data?.clientSecret|| null,
  };

  res.status(data.statusCode).json(response);
};

export default sendResponse;