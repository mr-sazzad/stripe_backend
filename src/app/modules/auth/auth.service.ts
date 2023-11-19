import ApiError from '../../../errors/ApiError';

import { IUser } from '../user/users.interface';
import User from '../user/users.model';
import {
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interface';

import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import httpStatus from 'http-status';



const createUser = async (userData: IUser): Promise<IUser | null> => {
  try {
    const { name, email, password } = userData;

    if (!name || !email || !password) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid user data');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already exists');
    }

    const newUser = await User.create(userData);
    return newUser;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user');
  }
};

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  const isUserExist = await User.isUserExist(email);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found');
  }

  if (
    isUserExist.password &&
    !(await User.isPasswordMatched(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  const { _id: id, role, name } = isUserExist; 

  const accessToken = jwtHelpers.createToken(
    { id, role, name }, 
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );
//console.log(accessToken)
  const refreshToken = jwtHelpers.createToken(
    { id, role,name },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return { accessToken, refreshToken };
};


const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  let verifiedToken = null;

  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  const { id, email } = verifiedToken;

  const isUserExist = await User.isUserExist(email);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  const newAccessToken = jwtHelpers.createToken(
    {
      id: isUserExist._id,
      role: isUserExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

export const AuthService = {
  createUser,
  loginUser,
  refreshToken,
};
