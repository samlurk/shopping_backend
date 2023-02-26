import { sign, verify } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { User } from '../interfaces/user.interface';

const JWT_SECRET = process.env.JWT_SECRET as string;

export const generateToken = async ({
  _id,
  email,
  role,
  metadata: { isBlocked }
}: Pick<User, '_id' | 'email' | 'password' | 'role' | 'metadata'>) => {
  const jwt = sign({ _id, email, role, isBlocked }, JWT_SECRET, {
    expiresIn: '2h'
  });
  return jwt;
};

export const verifyToken = async (jwt: string) => {
  const checkToken = verify(jwt, JWT_SECRET);
  return checkToken;
};
