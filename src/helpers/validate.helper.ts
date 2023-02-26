import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import APIResponse from './APIResponse.handle';

export const validateResult = (req: Request, res: Response, next: NextFunction) => {
  try {
    validationResult(req).throw();
    next();
  } catch (err) {
    const response = APIResponse.forbidden('Error processing data', err);
    return res.status(response.code).send(response);
  }
};
