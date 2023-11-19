import { SortOrder } from 'mongoose';

export type IOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  searchTerm?: string;
};

export type IOptionsResult = {
  page?: number;
  limit?: number;
  skip?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  searchTerm?: string;
};

const calculatePagination = (options: IOptions): IOptionsResult => {
  const page = Number(options.page || 1);
  const limit = Number(options.limit || 10);
  const skip = (page - 1) * limit;

  const sortBy = options.sortBy || 'createdAt';
  const sortOrder = options.sortOrder || 'desc';
  const minPrice = options.minPrice || 0;
  const maxPrice = options.maxPrice || 0;
  const location = options.location || '';
  const searchTerm = options.searchTerm || '';

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
    minPrice,
    maxPrice,
    location,
    searchTerm,
  };
};

export const paginationHelpers = {
  calculatePagination,
};
