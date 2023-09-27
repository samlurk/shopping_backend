import type { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { forbidden, serverError } from './APIResponse.handle';
import type { HttpMessageResponse } from '../interfaces/httpMessageResponse.interface';

export const validateResult = (req: Request, res: Response, next: NextFunction): Response | undefined => {
  try {
    validationResult(req).throw();
    next();
  } catch (err) {
    const response = forbidden('Error processing data', err);
    return res.status(response.code).send(response);
  }
};

export const validateAllowedBodyParams = (allowedFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const incomingData = Object.keys(req.body);
      const invalidParams = incomingData.filter((field) => !allowedFields.includes(field));
      if (invalidParams.length > 0) {
        const errors = invalidParams.reduce(
          (acc, key) => {
            acc = [{ value: req.body[key], msg: 'Invalid param', param: key, location: 'body' }];
            return acc;
          },
          [{}]
        );
        throw forbidden('Error processing data', { errors });
      }
      next();
    } catch (err) {
      let typedError: HttpMessageResponse;
      if (err instanceof Error) {
        typedError = serverError(err.message);
        return res.status(typedError.code).send(typedError);
      } else typedError = err as HttpMessageResponse;
      return res.status(typedError.code).send(typedError);
    }
  };
};
