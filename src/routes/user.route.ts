import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { Role } from '../enums/role.enum';
import { checkJwt, checkRole } from '../middlewares/session.middleware';
import { validateCreate, validateId, validateUpdate } from '../validators/user.validator';

const router = Router();
const { getAll, getOne, create, updateOne, deleteOne, blockUser, unblockUser } = new UserController();

router.get('/all-users', checkJwt, checkRole(Role.Admin), getAll);
router.get('/:id', checkJwt, checkRole(Role.Admin), validateId, getOne);
router.post('/', checkJwt, checkRole(Role.Admin), validateCreate, create);
router.put('/edit-user/:id', checkJwt, checkRole(Role.Admin), validateId, validateUpdate, updateOne);
router.delete('/:id', checkJwt, checkRole(Role.Admin), validateId, deleteOne);
router.put('/block-user/:id', checkJwt, checkRole(Role.Admin), validateId, blockUser);
router.put('/unblock-user/:id', checkJwt, checkRole(Role.Admin), validateId, unblockUser);
export { router };
