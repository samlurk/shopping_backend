import type { Request, Response } from 'express';
import { UserService } from '../services/user.service';

export class UserController<T extends Request, U extends Response> {
  async create({ body }: T, res: U): Promise<U> {
    try {
      const userService = new UserService();
      return res.status(200).send(await userService.addUser(body));
    } catch (e) {
      return res.status(500).send({ status: 'FAILED', message: e });
    }
  }

  async getAll(_: T, res: U): Promise<U> {
    try {
      const userService = new UserService();
      return res.status(200).send(await userService.getUsers());
    } catch (e) {
      return res.status(500).send({ status: 'FAILED', message: e });
    }
  }
  async getOne({ params: { id } }: T, res: U) {
    try {
      const userService = new UserService();
      return res.status(200).send(await userService.getUser(id));
    } catch (e) {
      return res.status(500).send({ status: 'FAILED', message: e });
    }
  }
  async updateOne({ params: { id }, body }: T, res: U) {
    try {
      const userService = new UserService();
      return res.status(200).send(await userService.updateUser(id, body));
    } catch (e) {
      return res.status(500).send({ status: 'FAILED', message: e });
    }
  }
  async deleteOne({ params: { id } }: T, res: U) {
    try {
      const userService = new UserService();
      return res.status(200).send(await userService.deleteUser(id));
    } catch (e) {
      return res.status(500).send({ status: 'FAILED', message: e });
    }
  }
}
