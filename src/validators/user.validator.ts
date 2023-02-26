import { Request, Response, NextFunction } from 'express';
import { check } from 'express-validator';
import { validateResult } from '../helpers/validate.helper';

export const validateCreate = [
  check('firstName').exists().not().isEmpty().withMessage('The first name must not be empty'),
  check('lastName').exists().not().isEmpty().withMessage('The last name must not be empty'),
  check('email')
    .exists()
    .not()
    .isEmpty()
    .withMessage('The email must not be empty')
    .isEmail()
    .withMessage('You must enter a valid email address'),
  check('password')
    .exists()
    .not()
    .isEmpty()
    .withMessage('The password must not be empty')
    .isLength({ min: 8 })
    .withMessage('The password must be at least 8 characters long'),
  check('phone')
    .exists()
    .not()
    .isEmpty()
    .withMessage('The phone number must not be empty')
    .isLength({ min: 7, max: 14 })
    .withMessage('The phone number must be at least 7 characters minimum and 14 characters maximum')
    .matches(/^\+/)
    .withMessage('The phone number must begin with "+".'),
  check('role')
    .exists()
    .not()
    .isEmpty()
    .withMessage('The role must not be empty')
    .isIn(['vendor', 'customer', 'admin'])
    .withMessage('The role entered is not valid'),
  check('address').optional().not().isEmpty().withMessage('The address must not be empty'),
  check('avatar').optional().isURL().withMessage('The address must contain a valid URL'),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  }
];

export const validateUpdate = [
  check('firstName').optional().not().isEmpty().withMessage('The first name must not be empty'),
  check('lastName').optional().not().isEmpty().withMessage('The last name must not be empty'),
  check('email')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The email must not be empty')
    .isEmail()
    .withMessage('You must enter a valid email address'),
  check('password')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The password must not be empty')
    .isLength({ min: 8 })
    .withMessage('The password must be at least 8 characters long'),
  check('phone')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The phone number must not be empty')
    .isLength({ min: 7, max: 14 })
    .withMessage('The phone number must be at least 7 characters minimum and 14 characters maximum')
    .matches(/^\+/)
    .withMessage('The phone number must begin with "+".'),
  check('role')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The role must not be empty')
    .isIn(['vendor', 'customer', 'admin'])
    .withMessage('The role entered is not valid'),
  check('address').optional().not().isEmpty().withMessage('The address must not be empty'),
  check('avatar').optional().isURL().withMessage('The address must contain a valid URL'),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  }
];
