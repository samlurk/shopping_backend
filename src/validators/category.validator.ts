import type { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { validateAllowedBodyParams, validateResult } from '../helpers/validate.helper';
import { Type } from '../enums/category.enum';

export const validateCreateCategory = [
  body('title').exists().not().isEmpty().withMessage('The category title must not be empty'),
  body('type')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The category type must not be empty')
    .isIn([Type.Post, Type.Product])
    .withMessage('The category type must contain a valid type'),
  validateAllowedBodyParams(['title', 'type']),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  }
];

export const validateUpdateCategory = [
  body('title').exists().not().isEmpty().withMessage('The category title must not be empty'),
  body('type')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The category type must not be empty')
    .isIn([Type.Post, Type.Product])
    .withMessage('The category type must contain a valid type'),
  validateAllowedBodyParams(['title', 'type']),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  }
];
