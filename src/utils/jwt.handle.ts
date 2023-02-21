import { sign, verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

export const generateToken = async (id: string) => {
  const jwt = sign({ id }, JWT_SECRET, {
    expiresIn: '2h'
  });
  return jwt;
};

export const verifyToken = async (jwt: string) => {
  const checkToken = verify(jwt, JWT_SECRET);
  return checkToken;
};
