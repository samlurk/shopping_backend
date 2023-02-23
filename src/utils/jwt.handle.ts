import { sign, verify } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET as string;

export const generateToken = async (id: ObjectId, email: string) => {
  const jwt = sign({ id, email }, JWT_SECRET, {
    expiresIn: '2h'
  });
  return jwt;
};

export const verifyToken = async (jwt: string) => {
  const checkToken = verify(jwt, JWT_SECRET);
  return checkToken;
};
