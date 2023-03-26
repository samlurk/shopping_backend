import type { Response, Request } from 'express';
import nodemailer from 'nodemailer';
import { created } from '../helpers/APIResponse.handle';
import type { HttpMessageResponse } from '../interfaces/httpMessageResponse.interface';

export class EmailController<T extends Request, U extends Response> {
  async create(_: T, res: U): Promise<U> {
    try {
      const response = created('Email created');
      return res.status(response.code).send(response);
    } catch (err) {
      const typedError = err as HttpMessageResponse;
      return res.status(typedError.code).send(typedError);
    }
  }
}
