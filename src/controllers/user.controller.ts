import type { Request, Response } from 'express';
import { UserService } from '../services/user.service';

export class UserController<T extends Request, U extends Response> {
  async create({ body }: T, res: U): Promise<Response> {
    try {
      const user = new UserService(body);
      const { email, phone } = user;
      const ifUserExists = await user.getUserByPhoneAndEmail({ phone, email });
      if (ifUserExists) throw 'User already exists';
      const userResponse = await user.add(body);
      return res.status(200).send(userResponse);
    } catch (e) {
      return res.status(500).send({ message: e });
    }
  }
}
