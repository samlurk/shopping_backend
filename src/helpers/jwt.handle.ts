import { type JwtPayload, sign, verify } from 'jsonwebtoken';
import type { User } from '../interfaces/user.interface';

const JWT_SECRET = process.env.JWT_SECRET as string;

export const generateToken = async ({ _id, role }: Pick<User, '_id' | 'role'>): Promise<string> => {
  const jwt = sign({ _id, role }, JWT_SECRET, {
    expiresIn: '2h'
  });
  return jwt;
};

export const verifyToken = async (jwt: string): Promise<string | JwtPayload | undefined> => {
  const checkToken = verify(jwt, JWT_SECRET);
  return checkToken;
};
