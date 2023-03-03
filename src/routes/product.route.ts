import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { Role } from '../enums/user.enum';
import { checkCookieJwt, checkRole } from '../middlewares/auth.middleware';
import { validateId } from '../validators/param.validator';
import { validateCreateProduct, validateUpdateProduct } from '../validators/product.validator';

const router = Router();
const { getAll, create, getOne, deleteOne, updateOne } = new ProductController();

router.get('/all-products', checkCookieJwt, checkRole(Role.Vendor), getAll);
router.get('/:id', checkCookieJwt, checkRole(Role.Vendor), validateId, getOne);
router.post('/', checkCookieJwt, checkRole(Role.Vendor), validateCreateProduct, create);
router.put('/edit-product/:id', checkCookieJwt, checkRole(Role.Vendor), validateId, validateUpdateProduct, updateOne);
router.delete('/:id', checkCookieJwt, checkRole(Role.Vendor), validateId, deleteOne);

export { router };
