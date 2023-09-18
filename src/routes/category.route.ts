import { Router } from 'express';
import CategoryController from '../controllers/category.controller';
import { authRoleMiddleware, authSessionMiddleware } from '../middlewares/auth.middleware';
import { Role } from '../enums/user.enum';
import { validateId } from '../validators/param.validator';
import { validateCreateCategory, validateUpdateCategory } from '../validators/category.validator';

const router = Router();
const { createOneCategory, getAllCategories, getOneCategory, updateOneCategory, deleteOneCategory } =
  new CategoryController();

router.post('/', authSessionMiddleware, authRoleMiddleware(Role.Admin), validateCreateCategory, createOneCategory);

router.get('/all-categories', authSessionMiddleware, getAllCategories);

router.get('/:id', authSessionMiddleware, validateId, getOneCategory);

router.put(
  '/edit-category/:id',
  authSessionMiddleware,
  authRoleMiddleware(Role.Admin),
  validateId,
  validateUpdateCategory,
  updateOneCategory
);

router.delete('/:id', authSessionMiddleware, authRoleMiddleware(Role.Admin), validateId, deleteOneCategory);

export { router };
