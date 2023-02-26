import type { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { ok } from '../helpers/APIResponse.handle';
import type { HttpMessageResponse } from '../interfaces/httpMessageResponse.interface';

export class AuthController<T extends Request, U extends Response> {
  async login({ body }: T, res: U): Promise<U> {
    try {
      const auth = new AuthService();
      const response = ok('User successfully logged in', await auth.loginUser(body));
      return res.status(response.code).send(response);
    } catch (err) {
      const typedError = err as HttpMessageResponse;
      return res.status(typedError.code).send(typedError);
    }
  }
}
