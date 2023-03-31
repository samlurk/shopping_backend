import type { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { validateResult } from '../helpers/validate.helper';

export const validatePostId = [
  body('postId')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The postId must not be empty')
    .isMongoId()
    .withMessage("It's not an postId"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  }
];

export const validateCreatePost = [
  body('title').exists().not().isEmpty().withMessage('The post name must not be empty'),
  body('description').exists().not().isEmpty().withMessage('The post description must not be empty'),
  body('category')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The post category must not be empty')
    .isObject()
    .withMessage('The post category must be an Object'),
  body('category._id')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The categoryId must not be empty')
    .isMongoId()
    .withMessage('The categoryId must be an ObjectId'),
  body('image').optional().isURL().withMessage('The image must contain a valid URL'),
  body('likes')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The post likes must not be empty')
    .isObject()
    .withMessage('The post likes must be an Object'),
  body('likes.active')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The active likes must not be empty')
    .isBoolean()
    .withMessage('The active likes must contain a valid boolean'),
  body('dislikes')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The post dislikes must not be empty')
    .isObject()
    .withMessage('The post dislikes must be an Object'),
  body('dislikes.active')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The active dislikes must not be empty')
    .isBoolean()
    .withMessage('The active dislikes must contain a valid boolean'),
  body('image').optional().isURL().withMessage('The image must contain a valid URL'),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  }
];

export const validateUpdatePost = [
  body('title').optional().not().isEmpty().withMessage('The post name must not be empty'),
  body('description').optional().not().isEmpty().withMessage('The post description must not be empty'),
  body('category')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The post category must not be empty')
    .isObject()
    .withMessage('The post category must be an Object'),
  body('category._id')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The categoryId must not be empty')
    .isMongoId()
    .withMessage('The categoryId must be an ObjectId'),
  body('image').optional().isURL().withMessage('The image must contain a valid URL'),
  body('likes')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The post likes must not be empty')
    .isObject()
    .withMessage('The post likes must be an Object'),
  body('likes.active')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The active likes must not be empty')
    .isBoolean()
    .withMessage('The active likes must contain a valid boolean'),
  body('dislikes')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The post dislikes must not be empty')
    .isObject()
    .withMessage('The post dislikes must be an Object'),
  body('dislikes.active')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The active dislikes must not be empty')
    .isBoolean()
    .withMessage('The active dislikes must contain a valid boolean'),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  }
];
