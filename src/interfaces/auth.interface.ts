import type { JwtPayload } from 'jsonwebtoken';
import type { UserSession } from '../types/auth.type';

export interface LoginUserDto {
  authEmail: string;
  authPassword: string;
}

export interface ReqJwt {
  user?: JwtPayload | UserSession;
}
