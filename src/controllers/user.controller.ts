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

  async getAll(_: T, res: U): Promise<U> {
    try {
      const userService = new UserService();
      return res.status(200).send(await userService.getUsers());
    } catch (e) {
      return res.status(500).send({ message: e, sucess: false });
    }
  }
}
