import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { Role } from '../enums/user.enum';
import { authSessionMiddleware, authRoleMiddleware } from '../middlewares/auth.middleware';
import { validateId } from '../validators/param.validator';
import { validateCreateProduct, validateUpdateProduct } from '../validators/product.validator';

const router = Router();
const { getAll, createOne, getOne, deleteOne, updateOne } = new ProductController();

router.get('/all-products', authSessionMiddleware, authRoleMiddleware(Role.Admin), getAll);
router.get('/:id', authSessionMiddleware, authRoleMiddleware(Role.Admin), validateId, getOne);
router.post('/', authSessionMiddleware, authRoleMiddleware(Role.Admin), validateCreateProduct, createOne);
router.put(
  '/edit-product/:id',
  authSessionMiddleware,
  authRoleMiddleware(Role.Admin),
  validateId,
  validateUpdateProduct,
  updateOne
);
router.delete('/:id', authSessionMiddleware, authRoleMiddleware(Role.Admin), validateId, deleteOne);

export { router };
