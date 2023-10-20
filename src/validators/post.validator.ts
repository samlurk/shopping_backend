import type { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { validateAllowedBodyParams, validateResult } from '../helpers/validate.helper';

export const validatePostId = [
  body('postId')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The postId must not be empty')
    .isMongoId()
    .withMessage("It's not an postId"),
  validateAllowedBodyParams(['postId']),
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
    .withMessage('The category must not be empty')
    .isMongoId()
    .withMessage('The category must be an ObjectId'),
  body('image').optional().isURL().withMessage('The image must contain a valid URL'),
  body('interactions')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The interactions must not be empty')
    .isBoolean()
    .withMessage('The interactions must contain a valid boolean'),
  validateAllowedBodyParams(['title', 'description', 'category', 'image', 'interactions']),
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
    .withMessage('The category must not be empty')
    .isMongoId()
    .withMessage('The category must be an ObjectId'),
  body('image').optional().isURL().withMessage('The image must contain a valid URL'),
  body('interactions')
    .optional()
    .not()
    .isEmpty()
    .withMessage('The interactions must not be empty')
    .isBoolean()
    .withMessage('The interactions must contain a valid boolean'),
  validateAllowedBodyParams(['title', 'description', 'category', 'image', 'interactions']),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  }
];
