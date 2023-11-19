import User from './users.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { IUser } from './users.interface';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';

const getAllUsers = async (): Promise<IUser[]> => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to retrieve users'
    );
  }
};

const getAllUsersPagination = async (
  paginationOptions: any
): Promise<IUser[]> => {
  try {
    const {
      page,
      limit,
      sortBy,
      sortOrder,
      minPrice,
      maxPrice,
      location,
      searchTerm,
    } = paginationOptions;

    const query: any = {};

    if (minPrice !== undefined) {
      query.price = { $gte: minPrice };
    }
    if (maxPrice !== undefined) {
      if (query.price) {
        query.price.$lte = maxPrice;
      } else {
        query.price = { $lte: maxPrice };
      }
    }
    if (location) {
      query.location = location;
    }
    if (searchTerm) {
      query.$or = [
        { username: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit);

    return users;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to retrieve users'
    );
  }
};

const getUserById = async (id: string): Promise<IUser | null> => {
  try {
    const user = await User.findById(id);
    return user;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to retrieve user'
    );
  }
};

const updateUserById = async (
  id: string,
  updatedData: Partial<IUser>
): Promise<IUser | null> => {
  try {
    const user = await User.findByIdAndUpdate(id, updatedData, { new: true });

    if (user) {
      return user;
    } else {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to update user'
    );
  }
};

const deleteUserById = async (id: string): Promise<IUser | null> => {
  try {
    const user = await User.findByIdAndDelete(id);
    return user;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to delete user'
    );
  }
};
const createUser = async (userData: IUser): Promise<IUser | null> => {
  try {
    const user = new User(userData);
    await user.save();
    return user;
  } catch (error) {
    throw new Error('Failed to create user');
  }
};

export const UserService = {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  getAllUsersPagination,
  createUser,
};
