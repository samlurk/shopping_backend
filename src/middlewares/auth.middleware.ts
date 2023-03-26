import type { Response, NextFunction } from 'express';
import { type Role } from '../enums/user.enum';
import type { ReqExtJwt, User } from '../interfaces/user.interface';
import { unauthorized } from '../helpers/APIResponse.handle';
import { verifyToken } from '../helpers/jwt.handle';
import { type HttpMessageResponse } from '../interfaces/httpMessageResponse.interface';
import { type WithId } from 'mongodb';

export const authSessionMiddleware = async (
  req: ReqExtJwt,
  res: Response,
  next: NextFunction
): Promise<Response | undefined> => {
  try {
    const user = (await verifyToken(req.cookies.token)) as WithId<User>;
    req.user = user;
    next();
  } catch (err) {
    const typedError = err as HttpMessageResponse;
    res.clearCookie('token');
    return res.status(typedError.code).send(typedError);
  }
};
export const authRoleMiddleware = (
  role: Role
): ((req: ReqExtJwt, res: Response, next: NextFunction) => Promise<Response | undefined>) => {
  return async (req: ReqExtJwt, res: Response, next: NextFunction) => {
    try {
      const user = req.user as User;
      if (typeof user !== 'string' && user !== null && user.role === role) next();
      else throw unauthorized('Access denied');
    } catch (err) {
      const typedError = err as HttpMessageResponse;
      return res.status(typedError.code).send(typedError);
    }
  };
};
