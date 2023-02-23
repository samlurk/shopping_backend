import type { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import APIResponse from '../utils/APIResponse.handle';
import { HttpMessageResponse } from '../interfaces/httpMessageResponse.interface';

export class UserController<T extends Request, U extends Response> {
  async create({ body }: T, res: U): Promise<U> {
    try {
      const userService = new UserService();
      const response = APIResponse.created('User created', await userService.addUser(body));
      return res.status(response.code).send(response);
    } catch (err) {
      const typedError = err as HttpMessageResponse;
      return res.status(typedError.code).send(typedError);
    }
  }

  async getAll(_: T, res: U): Promise<U> {
    try {
      const userService = new UserService();
      const response = APIResponse.ok('Users received', await userService.getUsers());
      return res.status(response.code).send(response);
    } catch (err) {
      const typedError = err as HttpMessageResponse;
      return res.status(typedError.code).send(typedError);
    }
  }
  async getOne({ params: { id } }: T, res: U) {
    try {
      const userService = new UserService();
      const response = APIResponse.ok('User received', await userService.getUser(id));
      return res.status(response.code).send(response);
    } catch (err) {
      const typedError = err as HttpMessageResponse;
      return res.status(typedError.code).send(typedError);
    }
  }
  async updateOne({ params: { id }, body }: T, res: U) {
    try {
      const userService = new UserService();
      const response = APIResponse.ok('User updated', await userService.updateUser(id, body));
      return res.status(response.code).send(response);
    } catch (err) {
      const typedError = err as HttpMessageResponse;
      return res.status(typedError.code).send(typedError);
    }
  }
  async deleteOne({ params: { id } }: T, res: U) {
    try {
      const userService = new UserService();
      await userService.deleteUser(id);
      const response = APIResponse.deleted('User removed');
      return res.status(response.code).send(response);
    } catch (err) {
      const typedError = err as HttpMessageResponse;
      return res.status(typedError.code).send(typedError);
    }
  }
}
