import type { JwtPayload } from 'jsonwebtoken';
import type { UserSession } from '../types/auth.type';

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface ReqJwt {
  user?: JwtPayload | UserSession;
}
