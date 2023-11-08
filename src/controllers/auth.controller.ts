import type { Request, Response } from 'express';
import AuthService from '../services/auth.service';
import { created, ok, serverError } from '../helpers/api-response.helper';
import type { HttpMessageResponse } from '../interfaces/httpMessageResponse.interface';
import type { LoginUserDto } from '../interfaces/auth.interface';

export default class AuthController {
  authService: AuthService;

  constructor(authServiceInstance?: AuthService) {
    this.authService = authServiceInstance !== undefined ? authServiceInstance : new AuthService();
  }

  async signup({ body }: Request, res: Response): Promise<Response> {
    try {
      const token = await this.authService.signupUser(body);
      const response = created('User successfully signed in', token);
      res.cookie('token', token.accessToken, { httpOnly: true });
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

  async login({ body }: Request<unknown, unknown, LoginUserDto, unknown>, res: Response): Promise<Response> {
    try {
      const token = await this.authService.loginUser(body);
      const response = ok('User successfully logged in', token);
      res.cookie('token', token.accessToken, { httpOnly: true });
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

  logout(_: Request, res: Response): Response {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true
    });
    const response = ok('Closed session');
    return res.status(response.code).send(response);
  }
}
