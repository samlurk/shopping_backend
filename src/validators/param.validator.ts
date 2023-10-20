import type { Request, Response, NextFunction } from 'express';
import { param } from 'express-validator';
import { validateResult } from '../helpers/validate.helper';

export const validateId = [
  param('id')
    .exists()
    .not()
    .isEmpty()
    .withMessage('The Id must not be empty')
    .isMongoId()
    .withMessage("It's not an Id"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  }
];
