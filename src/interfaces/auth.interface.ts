import { Request } from 'express';
import { IUser } from '@/models/users.model';

export interface DataStoredInToken {
  _id: string;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: IUser;
}
