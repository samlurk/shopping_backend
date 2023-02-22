import type { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController<T extends Request, U extends Response> {
  async login({ body }: T, res: U): Promise<U> {
    try {
      const auth = new AuthService();
      return res.status(200).send(await auth.loginUser(body));
    } catch (e) {
      return res.status(500).send({ status: 'FAILED', message: e });
    }
  }
}
