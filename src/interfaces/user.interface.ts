import type { WithId } from 'mongodb';
import type { Request } from 'express';
import type { Role } from '../enums/role.enum';
import type { JwtPayload } from 'jsonwebtoken';

export interface MetaData {
  lastLogin: Date;
  isBlocked: boolean;
  timezone: string;
}
export interface User extends WithId<Document> {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  role: Role;
  address?: string;
  avatar?: string;
  metadata: MetaData;
  createAt?: Date;
}

export interface ReqExtJwt extends Request {
  user?: JwtPayload | string | User;
}
