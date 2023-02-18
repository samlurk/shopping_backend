import type { Request, Response } from 'express';
import { User } from '../interfaces/user.interface';
import { UserService } from '../services/user.service';
import { encrypt, verified } from '../utils/bcrypt.handle';

export class authController<T extends Request, U extends Response> {
  async login({ body }: T, res: U): Promise<U> {
    try {
      return res.status(200).send('User login sucessfully !!!');
    } catch (e) {
      return res.status(500).send({ message: e });
    }
  }
}
