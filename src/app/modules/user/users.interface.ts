import { Model } from 'mongoose';


export type IUser = {
  toObject?: any;
  _id?: string;
  password: string;
  role?: string | undefined;
  name?: string;
  email: string;
 
};

export type UserModel = {
  isUserExist(
    email: string
  ): Promise<Pick<IUser,'_id'| 'email' | 'password'|'role' |'name'>>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IUser>;


