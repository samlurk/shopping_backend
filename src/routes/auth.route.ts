import { Router, type Request, type Response } from 'express';
import { UserController } from '../controllers/user.controller';
import { AuthController } from '../controllers/auth.controller';
import { validateCreate } from '../validators/user.validator';

const router = Router();

const { create } = new UserController<Request, Response>();
const { login } = new AuthController<Request, Response>();

router.post('/register', validateCreate, create);
router.post('/login', login);

export { router };
