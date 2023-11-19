
import { Product } from './product.interface';
import { ProductModel } from './product.model';



const getAllProducts = async (): Promise<Product[]> => {
  try {
    const products = await ProductModel.find();
    return products;
  } catch (error) {
    throw new Error('Failed to retrieve products');
  }
};

const getProductById = async (productId: string): Promise<Product | null> => {
  try {
    const product = await ProductModel.findById(productId);
    return product;
  } catch (error) {
    throw new Error('Failed to retrieve the product by ID');
  }
};



export const ProductService = {

  getAllProducts,
  getProductById, 
};
