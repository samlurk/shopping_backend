import { Response, NextFunction } from 'express';
import { Role } from '../enums/role.enum';
import { ReqExtJwt, ReqExtRole } from '../interfaces/user.interface';
import APIResponse from '../utils/APIResponse.handle';
import { verifyToken } from '../utils/jwt.handle';

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
  return (req: ReqExtRole, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user && user.role === role) next();
    else {
      const response = APIResponse.unauthorized('Access denied');
      return res.status(response.code).send(response);
    }
  };
};
