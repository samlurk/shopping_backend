import type { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { created, ok, deleted, serverError } from '../helpers/api-response.helper';
import type { HttpMessageResponse } from '../interfaces/httpMessageResponse.interface';
import type { CreateUserDto } from '../interfaces/user.interface';
import type { ReqJwt } from '../interfaces/auth.interface';
import type { ParamsDictionary } from 'express-serve-static-core';
import type { ReqQueryDto } from '../interfaces/query.interface';
import { ObjectId } from 'mongodb';

export class UserController {
  async createOne({ body }: Request<unknown, unknown, CreateUserDto>, res: Response): Promise<Response> {
    try {
      const userService = new UserService();
      await userService.createOneUser(body);
      const response = created('User created');
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

  async getAll(
    { query }: Request<unknown, unknown, unknown, ReqQueryDto & qs.ParsedQs>,
    res: Response
  ): Promise<Response> {
    try {
      const userService = new UserService();
      const response = ok('Users received', await userService.getAllUsers(query));
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

  async getOne(
    { params: { id }, query }: Request<ParamsDictionary, unknown, unknown, ReqQueryDto & qs.ParsedQs>,
    res: Response
  ): Promise<Response> {
    try {
      const userService = new UserService();
      const response = ok(
        'User received',
        await userService.getOneUser({ _id: new ObjectId(id), fields: query.fields })
      );
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

  async updateOne({ params: { id }, body }: Request, res: Response): Promise<Response> {
    try {
      const userService = new UserService();
      await userService.updateOneUser(id, body);
      const response = ok('User updated');
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

  async deleteOne({ params: { id } }: Request, res: Response): Promise<Response> {
    try {
      const userService = new UserService();
      await userService.deleteOneUser(id);
      const response = deleted('User removed');
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

  async blockOne({ params: { id } }: Request, res: Response): Promise<Response> {
    try {
      const userService = new UserService();
      await userService.blockOneUser(id);
      const response = ok('User blocked');
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

  async unblockOne({ params: { id } }: Request, res: Response): Promise<Response> {
    try {
      const userService = new UserService();
      await userService.unblockOneUser(id);
      const response = ok('User unblocked');
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

  async updatePassword({ user, body: { password, oldPassword } }: Request & ReqJwt, res: Response): Promise<Response> {
    try {
      const userService = new UserService();
      await userService.updateOneUserPassword(user?._id, password, oldPassword);
      const response = ok('User password updated');
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

  async forgotPassword({ body: { email } }: Request, res: Response): Promise<Response> {
    try {
      const userService = new UserService();
      await userService.forgotOneUserPassword(email);
      const response = ok('Reset password email has been sent to your email successfully');
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

  async resetPassword({ params: { token }, body: { password } }: Request, res: Response): Promise<Response> {
    try {
      const userService = new UserService();
      await userService.resetOneUserPassword(token, password);
      const response = ok('Password successfully reset');
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
}
