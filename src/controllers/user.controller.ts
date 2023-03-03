import type { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { created, ok, deleted } from '../helpers/APIResponse.handle';
import type { HttpMessageResponse } from '../interfaces/httpMessageResponse.interface';

export class UserController<T extends Request, U extends Response> {
  async create({ body }: T, res: U): Promise<U> {
    try {
      const userService = new UserService();
      const response = created('User created', await userService.addUser(body));
      return res.status(response.code).send(response);
    } catch (err) {
      const typedError = err as HttpMessageResponse;
      return res.status(typedError.code).send(typedError);
    }
  }

  async getAll(_: T, res: U): Promise<U> {
    try {
      const userService = new UserService();
      const response = ok('Users received', await userService.getUsers());
      return res.status(response.code).send(response);
    } catch (err) {
      const typedError = err as HttpMessageResponse;
      return res.status(typedError.code).send(typedError);
    }
  }

  async getOne({ params: { id } }: T, res: U): Promise<U> {
    try {
      const userService = new UserService();
      const response = ok('User received', await userService.getUser(id));
      return res.status(response.code).send(response);
    } catch (err) {
      const typedError = err as HttpMessageResponse;
      return res.status(typedError.code).send(typedError);
    }
  }

  async updateOne({ params: { id }, body }: T, res: U): Promise<U> {
    try {
      const userService = new UserService();
      await userService.updateUser(id, body);
      const response = ok('User updated');
      return res.status(response.code).send(response);
    } catch (err) {
      const typedError = err as HttpMessageResponse;
      return res.status(typedError.code).send(typedError);
    }
  }

  async deleteOne({ params: { id } }: T, res: U): Promise<U> {
    try {
      const userService = new UserService();
      await userService.deleteUser(id);
      const response = deleted('User removed');
      return res.status(response.code).send(response);
    } catch (err) {
      const typedError = err as HttpMessageResponse;
      return res.status(typedError.code).send(typedError);
    }
  }

  async blockUser({ params: { id } }: T, res: U): Promise<U> {
    try {
      const userService = new UserService();
      await userService.blockOrUnlockUser(id, true);
      const response = ok('User blocked');
      return res.status(response.code).send(response);
    } catch (err) {
      const typedError = err as HttpMessageResponse;
      return res.status(typedError.code).send(typedError);
    }
  }

  async unblockUser({ params: { id } }: T, res: U): Promise<U> {
    try {
      const userService = new UserService();
      await userService.blockOrUnlockUser(id, false);
      const response = ok('User unblocked');
      return res.status(response.code).send(response);
    } catch (err) {
      const typedError = err as HttpMessageResponse;
      return res.status(typedError.code).send(typedError);
    }
  }
}
