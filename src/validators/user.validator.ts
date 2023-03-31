import type { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { validateResult } from '../helpers/validate.helper';

export const validateCreateUser = [
  body('firstName').exists().not().isEmpty().withMessage('The first name must not be empty'),
  body('lastName').exists().not().isEmpty().withMessage('The last name must not be empty'),
  body('email')
    .exists()
    .not()
    .isEmpty()
    .withMessage('The email must not be empty')
    .isEmail()
    .withMessage('You must enter a valid email address'),
  body('password')
    .exists()
    .not()
    .isEmpty()
    .withMessage('The password must not be empty')
    .isLength({ min: 8 })
    .withMessage('The password must be at least 8 characters long'),
  body('phone')
    .exists()
    .not()
    .isEmpty()
    .withMessage('The phone number must not be empty')
    .isLength({ min: 7, max: 14 })
    .withMessage('The phone number must be at least 7 characters minimum and 14 characters maximum')
    .matches(/^\+/)
    .withMessage('The phone number must begin with "+".'),
  body('role')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The role must not be empty')
    .isIn(['vendor', 'customer', 'admin'])
    .withMessage('The role entered is not valid'),
  body('address').optional().not().isEmpty().withMessage('The address must not be empty'),
  body('avatar').optional().isURL().withMessage('The address must contain a valid URL'),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  }
];

export const validateUpdateUser = [
  body('firstName').optional().not().isEmpty().withMessage('The first name must not be empty'),
  body('lastName').optional().not().isEmpty().withMessage('The last name must not be empty'),
  body('email')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The email must not be empty')
    .isEmail()
    .withMessage('You must enter a valid email address'),
  body('password')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The password must not be empty')
    .isLength({ min: 8 })
    .withMessage('The password must be at least 8 characters long'),
  body('phone')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The phone number must not be empty')
    .isLength({ min: 7, max: 14 })
    .withMessage('The phone number must be at least 7 characters minimum and 14 characters maximum')
    .matches(/^\+/)
    .withMessage('The phone number must begin with "+".'),
  body('role')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The role must not be empty')
    .isIn(['vendor', 'customer', 'admin'])
    .withMessage('The role entered is not valid'),
  body('address').optional().not().isEmpty().withMessage('The address must not be empty'),
  body('avatar').optional().isURL().withMessage('The avatar must contain a valid URL'),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  }
];

export const validateChangeUserPassword = [
  body('password')
    .exists()
    .not()
    .isEmpty()
    .withMessage('The password must not be empty')
    .isLength({ min: 8 })
    .withMessage('The password must be at least 8 characters long'),
  body('oldPassword')
    .exists()
    .not()
    .isEmpty()
    .withMessage('The password must not be empty')
    .isLength({ min: 8 })
    .withMessage('The password must be at least 8 characters long'),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  }
];

export const validateResetUserPassword = [
  body('password')
    .exists()
    .not()
    .isEmpty()
    .withMessage('The password must not be empty')
    .isLength({ min: 8 })
    .withMessage('The password must be at least 8 characters long'),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  }
];
