import { WithId } from 'mongodb';
import { Request } from 'express';
import { Role } from '../enums/role.enum';
import { JwtPayload } from 'jsonwebtoken';

export interface User extends WithId<Document> {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  role: Role;
  avatar?: string;
  createAt?: string;
}

export interface ReqExtJwt extends Request {
  user?: JwtPayload | string;
}
