import { Request, Response, NextFunction } from 'express';
import { ReqExtJwt } from '../interfaces/user.interface';
import { verifyToken } from '../utils/jwt.handle';

export const checkJwt = async (req: ReqExtJwt, res: Response, next: NextFunction) => {
  try {
    const jwtByUser = req.headers.authorization ? (req.headers.authorization.split(' ').pop() as string) : '';
    const verifiedToken = await verifyToken(jwtByUser);
    if (!verifiedToken) throw new Error();
    req.user = verifiedToken;
    next();
  } catch (_) {
    res.status(400).send('Invalid session');
  }
};
