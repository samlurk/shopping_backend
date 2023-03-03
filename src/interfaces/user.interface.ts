import type { Request } from 'express';
import type { Role } from '../enums/user.enum';
import type { JwtPayload } from 'jsonwebtoken';
import type { WithId } from 'mongodb';

export interface MetaData {
  lastLogin: Date;
  isBlocked: boolean;
  timezone: string;
}
export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  role: Role;
  address: string;
  avatar: string;
  metadata: MetaData;
  createAt: Date;
  updateAt: Date | 'never';
}

export interface ReqExtJwt extends Request {
  user?: JwtPayload | Pick<WithId<User>, '_id' | 'role'>;
}
