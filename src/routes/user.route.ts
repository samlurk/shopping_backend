import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { Role } from '../enums/user.enum';
import { checkCookieJwt, checkRole } from '../middlewares/auth.middleware';
import { validateCreateUser, validateUpdateUser } from '../validators/user.validator';
import { validateId } from '../validators/param.validator';

const router = Router();
const { getAll, getOne, create, updateOne, deleteOne, blockUser, unblockUser } = new UserController();

router.get('/all-users', checkCookieJwt, checkRole(Role.Admin), getAll);
router.get('/:id', checkCookieJwt, checkRole(Role.Admin), validateId, getOne);
router.post('/', checkCookieJwt, checkRole(Role.Admin), validateCreateUser, create);
router.put('/edit-user/:id', checkCookieJwt, checkRole(Role.Admin), validateId, validateUpdateUser, updateOne);
router.delete('/:id', checkCookieJwt, checkRole(Role.Admin), validateId, deleteOne);
router.put('/block-user/:id', checkCookieJwt, checkRole(Role.Admin), validateId, blockUser);
router.put('/unblock-user/:id', checkCookieJwt, checkRole(Role.Admin), validateId, unblockUser);

export { router };
