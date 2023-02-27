import type { Response, NextFunction } from 'express';
import { type Role } from '../enums/role.enum';
import type { ReqExtJwt, User } from '../interfaces/user.interface';
import { unauthorized } from '../helpers/APIResponse.handle';
import { verifyToken } from '../helpers/jwt.handle';
import { AuthService } from '../services/auth.service';
import { type HttpMessageResponse } from '../interfaces/httpMessageResponse.interface';

export const checkCookieJwt = async (
  req: ReqExtJwt,
  res: Response,
  next: NextFunction
): Promise<Response | undefined> => {
  try {
    const auth = new AuthService();
    const user = (await verifyToken(req.cookies.token)) as User;
    const verifiedUserDataToken = await auth.cookieJwtDataComparison({ _id: user._id, role: user.role });
    if (user === null) throw unauthorized('Access denied');
    if (verifiedUserDataToken === null) throw unauthorized('Invalid token');
    req.user = user;
    next();
  } catch (err) {
    const typedError = err as HttpMessageResponse;
    res.clearCookie('token');
    return res.status(typedError.code).send(typedError);
  }
};
export const checkRole = (
  role: Role
): ((req: ReqExtJwt, res: Response, next: NextFunction) => Promise<Response | undefined>) => {
  return async (req: ReqExtJwt, res: Response, next: NextFunction) => {
    try {
      const user = req.user as User;
      if (typeof user !== 'string' && user != null && user.role === role) next();
      else throw unauthorized('Access denied');
    } catch (err) {
      const typedError = err as HttpMessageResponse;
      return res.status(typedError.code).send(typedError);
    }
  };
};

// export const checkRole = (
//   role?: Role
// ): ((req: ReqExtJwt, res: Response, next: NextFunction) => Promise<Response | undefined>) => {
//   const auth = new AuthService();
//   return async (req: ReqExtJwt, res: Response, next: NextFunction) => {
//     const user = req.user as User;
//     const response = unauthorized('Access denied');

//     Object.values(Role).includes(Role.Admin | Role.Customer);
//     if (typeof user !== 'string' && user != null && user.role === role) {
//       if ((await auth.cookieJwtDataComparison({ _id: user._id, role: user.role })) != null) next();
//       else {
//         res.clearCookie('token');
//         return res.status(response.code).send(response);
//       }
//     } else return res.status(response.code).send(response);
//   };
// };
