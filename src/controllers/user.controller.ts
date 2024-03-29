import type { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { created, ok, deleted } from '../helpers/APIResponse.handle';
import type { HttpMessageResponse } from '../interfaces/httpMessageResponse.interface';
import type { ReqExtJwt } from '../interfaces/user.interface';

export class UserController<T extends Request, U extends Response> {
  async createOne({ body }: T, res: U): Promise<U> {
    try {
      const userService = new UserService();
      await userService.addUser(body);
      const response = created('User created');
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
      const response = ok('User received', await userService.getUserById(id));
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

  async updatePassword({ user, body: { password, oldPassword } }: ReqExtJwt, res: U): Promise<U> {
    try {
      const userService = new UserService();
      await userService.updateUserPassword(user?._id, password, oldPassword);
      const response = ok('User password updated');
      return res.status(response.code).send(response);
    } catch (err) {
      const typedError = err as HttpMessageResponse;
      return res.status(typedError.code).send(typedError);
    }
  }

  async forgotPassword({ body: { email } }: T, res: U): Promise<U> {
    try {
      const userService = new UserService();
      await userService.forgotUserPassword(email);
      const response = ok('Reset password email has been sent to your email successfully');
      return res.status(response.code).send(response);
    } catch (err) {
      const typedError = err as HttpMessageResponse;
      return res.status(typedError.code).send(typedError);
    }
  }

  async resetPassword({ params: { token }, body: { password } }: T, res: U): Promise<U> {
    try {
      const userService = new UserService();
      await userService.resetUserPassword(token, password);
      const response = ok('Password successfully reset');
      return res.status(response.code).send(response);
    } catch (err) {
      const typedError = err as HttpMessageResponse;
      return res.status(typedError.code).send(typedError);
    }
  }
}
