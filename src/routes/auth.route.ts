import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import { validateCreateUser } from '../validators/user.validator';
import { authSessionMiddleware } from '../middlewares/auth.middleware';

const router = Router();

const authController = new AuthController();
const { login, logout, signup } = authController;

router.post('/signup', validateCreateUser, signup);
router.post('/login', login);
router.get('/logout', authSessionMiddleware, logout);

export default router;
