import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { Role } from '../enums/user.enum';
import { authSessionMiddleware, authRoleMiddleware } from '../middlewares/auth.middleware';
import {
  validateCreateUser,
  validateUpdateUser,
  validateChangeUserPassword,
  validateResetUserPassword
} from '../validators/user.validator';
import { validateId } from '../validators/param.validator';

const router = Router();
const {
  getAll,
  getOne,
  create,
  updateOne,
  deleteOne,
  blockUser,
  unblockUser,
  updatePassword,
  forgotPassword,
  resetPassword
} = new UserController();

router.get('/all-users', authSessionMiddleware, authRoleMiddleware(Role.Admin), getAll);
router.get('/:id', authSessionMiddleware, authRoleMiddleware(Role.Admin), validateId, getOne);
router.post('/', authSessionMiddleware, authRoleMiddleware(Role.Admin), validateCreateUser, create);
router.put(
  '/edit-user/:id',
  authSessionMiddleware,
  authRoleMiddleware(Role.Admin),
  validateId,
  validateUpdateUser,
  updateOne
);
router.delete('/:id', authSessionMiddleware, authRoleMiddleware(Role.Admin), validateId, deleteOne);
router.put('/block-user/:id', authSessionMiddleware, authRoleMiddleware(Role.Admin), validateId, blockUser);
router.put('/unblock-user/:id', authSessionMiddleware, authRoleMiddleware(Role.Admin), validateId, unblockUser);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', validateResetUserPassword, resetPassword);

router.put('/password', authSessionMiddleware, validateChangeUserPassword, updatePassword);

export { router };
