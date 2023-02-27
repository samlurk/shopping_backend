import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { Role } from '../enums/role.enum';
import { checkCookieJwt, checkRole } from '../middlewares/auth.middleware';
import { validateCreate, validateId, validateUpdate } from '../validators/user.validator';

const router = Router();
const { getAll, getOne, create, updateOne, deleteOne, blockUser, unblockUser } = new UserController();

router.get('/all-users', checkCookieJwt, checkRole(Role.Admin), getAll);
router.get('/:id', checkCookieJwt, checkRole(Role.Admin), validateId, getOne);
router.post('/', checkCookieJwt, checkRole(Role.Admin), validateCreate, create);
router.put('/edit-user/:id', checkCookieJwt, checkRole(Role.Admin), validateId, validateUpdate, updateOne);
router.delete('/:id', checkCookieJwt, checkRole(Role.Admin), validateId, deleteOne);
router.put('/block-user/:id', checkCookieJwt, checkRole(Role.Admin), validateId, blockUser);
router.put('/unblock-user/:id', checkCookieJwt, checkRole(Role.Admin), validateId, unblockUser);

export { router };
