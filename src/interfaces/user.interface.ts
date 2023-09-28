import type { Role } from '../enums/user.enum';
import type { JwtPayload } from 'jsonwebtoken';
import type { UserSession } from '../types/user.type';

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  role: Role;
  address: string | null;
  avatar: string | null;
}

export interface MetaData {
  lastLogin: Date;
  isBlocked: boolean;
  timezone: string;
}

export interface ReqJwt {
  user?: JwtPayload | UserSession;
}
