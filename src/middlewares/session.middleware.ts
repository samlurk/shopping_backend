import { Response, NextFunction } from 'express';
import { Role } from '../enums/role.enum';
import { ReqExtJwt } from '../interfaces/user.interface';
import APIResponse from '../helpers/APIResponse.handle';
import { verifyToken } from '../helpers/jwt.handle';

export const checkJwt = async (req: ReqExtJwt, res: Response, next: NextFunction) => {
  try {
    const jwtByUser = req.headers.authorization ? (req.headers.authorization.split(' ').pop() as string) : '';
    const verifiedToken = await verifyToken(jwtByUser);
    if (!verifiedToken) throw new Error();
    req.user = verifiedToken;
    next();
  } catch (err) {
    const response = APIResponse.unauthorized('Access denied');
    return res.status(response.code).send(response);
  }
};
export const checkRole = (role: Role) => {
  return (req: ReqExtJwt, res: Response, next: NextFunction) => {
    const user = req.user;
    if (typeof user !== 'string' && user && user.role === role) next();
    else {
      const response = APIResponse.unauthorized('Access denied');
      return res.status(response.code).send(response);
    }
  };
};
