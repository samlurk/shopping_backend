import { Router, type Request, type Response } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();

const { create } = new UserController<Request, Response>();

router.post('/register', create);

export { router };
