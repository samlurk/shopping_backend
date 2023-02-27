import { Router, type Request, type Response } from 'express';
import { UserController } from '../controllers/user.controller';
import { AuthController } from '../controllers/auth.controller';
import { validateCreate } from '../validators/user.validator';
import { checkCookieJwt } from '../middlewares/auth.middleware';

const router = Router();

const { create } = new UserController<Request, Response>();
const { login, logout } = new AuthController<Request, Response>();

router.post('/register', validateCreate, create);
router.post('/login', login);
router.get('/logout', checkCookieJwt, logout);

export { router };
