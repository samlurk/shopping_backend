import { Response, NextFunction } from 'express';
import { Role } from '../enums/role.enum';
import { ReqExtJwt } from '../interfaces/user.interface';
import APIResponse from '../utils/APIResponse.handle';
import { verifyToken } from '../utils/jwt.handle';

export class Session {
  static async checkJwt(req: ReqExtJwt, res: Response, next: NextFunction) {
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
  }
  static checkRole(role: Role) {
    return (req: ReqExtJwt, res: Response, next: NextFunction) => {
      const user = req.user;
      if (typeof user !== 'string' && user && user.role === role) next();
      else {
        const response = APIResponse.unauthorized('Access denied');
        return res.status(response.code).send(response);
      }
    };
  }
}
