
import { Request, Response, RequestHandler } from 'express';
import httpStatus from 'http-status';
import sendResponse from '../../../shared/sendResponse';
import { ProductService } from './product.service';
import catchAsync from '../../../shared/catchAsync';
import { Product } from './product.interface';



const getAllProducts: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const products = await ProductService.getAllProducts();
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All products retrieved successfully',
        data: products,
      });
    } catch (error) {
      sendResponse(res, {
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Internal Server Error',
        data: null,
      });
    }
  }
);

const getProductById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const productId = req.params.id;

    try {
      const product = await ProductService.getProductById(productId);

      if (!product) {
        return sendResponse(res, {
          statusCode: httpStatus.NOT_FOUND,
          success: false,
          message: 'Product not found',
        });
      }

      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Product retrieved successfully',
        data: product,
      });
    } catch (error) {
      sendResponse(res, {
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Internal Server Error',
        data: null,
      });
    }
  }
);

export const ProductController = {
 
  getAllProducts,
  getProductById, 
};
