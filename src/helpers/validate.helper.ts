import type { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { forbidden } from './APIResponse.handle';

export const validateResult = (req: Request, res: Response, next: NextFunction): Response | undefined => {
  try {
    validationResult(req).throw();
    next();
  } catch (err) {
    const response = forbidden('Error processing data', err);
    return res.status(response.code).send(response);
  }
};
