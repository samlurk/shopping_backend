import type { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { ok, serverError } from '../helpers/api-response.helper';
import type { HttpMessageResponse } from '../interfaces/httpMessageResponse.interface';

export class AuthController<T extends Request, U extends Response> {
  async login({ body }: T, res: U): Promise<U> {
    try {
      const auth = new AuthService();
      const token = await auth.loginUser(body);
      const response = ok('User successfully logged in', token);
      res.cookie('token', token, { httpOnly: true });
      return res.status(response.code).send(response);
    } catch (err) {
      let typedError: HttpMessageResponse;
      if (err instanceof Error) {
        typedError = serverError(err.message);
        return res.status(typedError.code).send(typedError);
      } else typedError = err as HttpMessageResponse;
      return res.status(typedError.code).send(typedError);
    }
  }

  logout(_: T, res: U): U {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true
    });
    const response = ok('Closed session');
    return res.status(response.code).send(response);
  }
}
