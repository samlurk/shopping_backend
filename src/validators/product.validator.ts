import type { Request, Response, NextFunction } from 'express';
import { check } from 'express-validator';
import { validateResult } from '../helpers/validate.helper';

export const validateCreateProduct = [
  check('title').exists().not().isEmpty().withMessage('The product name must not be empty'),
  check('description').exists().not().isEmpty().withMessage('The product description must not be empty'),
  check('price')
    .exists()
    .not()
    .isEmpty()
    .withMessage('The product price must not be empty')
    .isNumeric()
    .withMessage('The product price must contain valid numbers'),
  check('slug')
    .exists()
    .not()
    .isEmpty()
    .withMessage('The product slug must not be empty')
    .isSlug()
    .withMessage('The product slug must be a valid slug'),
  check('category')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The product category must not be empty')
    .isObject()
    .withMessage('The product category must be an Object'),
  check('category._id')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The product categoryID must not be empty')
    .isMongoId()
    .withMessage('The product categoryID must be an ObjectId'),
  check('brand')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The product brand must not be empty')
    .isString()
    .withMessage('The product brand must be a valid string'),
  check('quantity')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The product quantity must not be empty')
    .isNumeric()
    .withMessage('The product quantity must be a valid number'),
  check('sold')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The product sold must not be empty')
    .isNumeric()
    .withMessage('The product sold must be a valid number'),
  check('images')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The product images must not be empty')
    .isArray()
    .withMessage('The product images must be a string arrays'),
  check('images.*')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The content of product images must not be empty')
    .isURL()
    .withMessage('The content of product images must be a valid URL'),
  check('color')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The product color must not be empty')
    .isIn([
      'black',
      'red',
      'blue',
      'green',
      'yellow',
      'purple',
      'pink',
      'orange',
      'brown',
      'gray',
      'silver',
      'navy blue',
      'sky blue',
      'lime green',
      'teal',
      'olive',
      'cyan',
      'maroon',
      'beige'
    ])
    .withMessage('The product color entered is not valid'),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  }
];

export const validateUpdateProduct = [
  check('title').optional().not().isEmpty().withMessage('The product name must not be empty'),
  check('description').optional().not().isEmpty().withMessage('The product description must not be empty'),
  check('price')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The product price must not be empty')
    .isNumeric()
    .withMessage('The product price must contain valid numbers'),
  check('slug')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The product slug must not be empty')
    .isSlug()
    .withMessage('The product slug must be a valid slug'),
  check('category')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The product category must not be empty')
    .isObject()
    .withMessage('The product category must be an Object'),
  check('category._id')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The product categoryID must not be empty')
    .isMongoId()
    .withMessage('The product categoryID must be an ObjectId'),
  check('brand')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The product brand must not be empty')
    .isString()
    .withMessage('The product brand must be a valid string'),
  check('quantity')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The product quantity must not be empty')
    .isNumeric()
    .withMessage('The product quantity must be a valid number'),
  check('sold')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The product sold must not be empty')
    .isNumeric()
    .withMessage('The product sold must be a valid number'),
  check('images')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The product images must not be empty')
    .isArray()
    .withMessage('The product images must be a string arrays'),
  check('images.*')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The content of product images must not be empty')
    .isURL()
    .withMessage('The content of product images must be a valid URL'),
  check('color')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The product color must not be empty')
    .isIn([
      'black',
      'red',
      'blue',
      'green',
      'yellow',
      'purple',
      'pink',
      'orange',
      'brown',
      'gray',
      'silver',
      'navy blue',
      'sky blue',
      'lime green',
      'teal',
      'olive',
      'cyan',
      'maroon',
      'beige'
    ])
    .withMessage('The product color entered is not valid'),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  }
];
