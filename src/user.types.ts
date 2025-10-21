import { HydratedDocument, Types } from 'mongoose';
import { User } from './v1/user/schema/user.schema';

export enum UserTypes {
  ADMIN = 1,
  DOCTOR,
  NURSE,
}

// export type IUserExtraDbFields = {
//   updatedAt: Date;
//   createdAt: Date;
//   _id: ObjectId;
// };

export type IUser<T extends 'api' | 'db'> = T extends 'api'
  ? Omit<User, 'password' | '_id'> & {
      id: string;
    }
  : User & {
      _id: Types.ObjectId;
    };

export type IUserDocument = HydratedDocument<IUser<'db'>>;

export type IReqUser = Pick<IUser<'db'>, '_id' | 'userType' | 'permissions'>;
