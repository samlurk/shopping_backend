import type { Request, Response } from 'express';
import { UserService } from '../services/user.service';

export class UserController<T extends Request, U extends Response> {
  async create({ body }: T, res: U): Promise<U> {
    try {
      const userService = new UserService();
      return res.status(200).send(await userService.add(body));
    } catch (e) {
      return res.status(500).send({ message: e });
    }
  }

  async getUser({ body }: T, res: U): Promise<Response> {
    try {
      return res.send('User received');
    } catch (e) {
      return res.status(500).send({ message: 'Error get user', sucess: false });
    }
  }
}
