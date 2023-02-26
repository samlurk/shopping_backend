import type { Response, NextFunction } from 'express';
import type { Role } from '../enums/role.enum';
import type { ReqExtJwt } from '../interfaces/user.interface';
import { unauthorized } from '../helpers/APIResponse.handle';
import { verifyToken } from '../helpers/jwt.handle';

export const checkJwt = async (req: ReqExtJwt, res: Response, next: NextFunction): Promise<Response | undefined> => {
  try {
    const jwtByUser = req.headers.authorization != null ? (req.headers.authorization.split(' ').pop() as string) : '';
    const verifiedToken = await verifyToken(jwtByUser);
    if (verifiedToken === null) throw new Error();
    req.user = verifiedToken;
    next();
  } catch (err) {
    const response = unauthorized('Access denied');
    return res.status(response.code).send(response);
  }
};
export const checkRole = (role: Role) => {
  return (req: ReqExtJwt, res: Response, next: NextFunction) => {
    const user = req.user;
    if (typeof user !== 'string' && user != null && user.role === role) next();
    else {
      const response = unauthorized('Access denied');
      return res.status(response.code).send(response);
    }
  };
};
