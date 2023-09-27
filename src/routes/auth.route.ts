import { Router, type Request, type Response } from 'express';
import { UserController } from '../controllers/user.controller';
import { AuthController } from '../controllers/auth.controller';
import { validateCreateUser } from '../validators/user.validator';
import { authSessionMiddleware } from '../middlewares/auth.middleware';

const router = Router();

const { createOne } = new UserController();
const { login, logout } = new AuthController<Request, Response>();

router.post('/register', validateCreateUser, createOne);
router.post('/login', login);
router.get('/logout', authSessionMiddleware, logout);

export { router };
