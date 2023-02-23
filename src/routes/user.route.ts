import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { Role } from '../enums/role.enum';
import { checkJwt, checkRole } from '../middlewares/session.middleware';

const router = Router();

const { getAll, getOne, create, updateOne, deleteOne } = new UserController();

router.get('/', checkJwt, checkRole(Role.Admin), getAll);
router.get('/:id', checkJwt, checkRole(Role.Admin), getOne);
router.post('/', checkJwt, checkRole(Role.Admin), create);
router.put('/:id', checkJwt, checkRole(Role.Admin), updateOne);
router.delete('/:id', checkJwt, checkRole(Role.Admin), deleteOne);
export { router };
