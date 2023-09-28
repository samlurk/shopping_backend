import type { Request, Response, NextFunction } from 'express';
import { type Role } from '../enums/user.enum';
import type { ReqJwt } from '../interfaces/user.interface';
import { serverError, unauthorized } from '../helpers/APIResponse.handle';
import { verifyToken } from '../helpers/jwt.handle';
import { type HttpMessageResponse } from '../interfaces/httpMessageResponse.interface';
import type { UserSession } from '../types/user.type';

export const authSessionMiddleware = async (
  req: Request & ReqJwt,
  res: Response,
  next: NextFunction
): Promise<Response | undefined> => {
  try {
    const user = (await verifyToken(req.cookies.token)) as UserSession;
    req.user = user;
    next();
  } catch (err) {
    res.clearCookie('token');
    let typedError: HttpMessageResponse;
    if (err instanceof Error) {
      typedError = serverError(err.message);
      return res.status(typedError.code).send(typedError);
    } else typedError = err as HttpMessageResponse;
    return res.status(typedError.code).send(typedError);
  }
};
export const authRoleMiddleware = (
  role: Role
): ((req: Request & ReqJwt, res: Response, next: NextFunction) => Promise<Response | undefined>) => {
  return async (req: ReqJwt, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (user !== undefined && user.role === role) next();
      else throw unauthorized('Access denied');
    } catch (err) {
      let typedError: HttpMessageResponse;
      if (err instanceof Error) {
        typedError = serverError(err.message);
        return res.status(typedError.code).send(typedError);
      } else typedError = err as HttpMessageResponse;
      return res.status(typedError.code).send(typedError);
    }
  };
};
