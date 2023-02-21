import { Router, type Request, type Response } from 'express';
import { UserController } from '../controllers/user.controller';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

const { create } = new UserController<Request, Response>();
const { login } = new AuthController<Request, Response>();

router.post('/register', create);
router.post('/login', login);

export { router };
