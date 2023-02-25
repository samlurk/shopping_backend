import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { Role } from '../enums/role.enum';
import { Session } from '../middlewares/session.middleware';

const router = Router();
const { checkJwt, checkRole } = Session;
const { getAll, getOne, create, updateOne, deleteOne, blockUser, unblockUser } = new UserController();

router.get('/user/all-users', checkJwt, checkRole(Role.Admin), getAll);
router.get('/user/:id', checkJwt, checkRole(Role.Admin), getOne);
router.post('/user', checkJwt, checkRole(Role.Admin), create);
router.put('/user/edit-user/:id', checkJwt, checkRole(Role.Admin), updateOne);
router.delete('/user/:id', checkJwt, checkRole(Role.Admin), deleteOne);
router.put('/user/block-user/:id', checkJwt, checkRole(Role.Admin), blockUser);
router.put('/user/unblock-user/:id', checkJwt, checkRole(Role.Admin), unblockUser);
export { router };
