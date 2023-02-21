import { Router, type Request, type Response } from 'express';
import { UserController } from '../controllers/user.controller';
import { checkJwt } from '../middlewares/session.middleware';

const router = Router();

const { getAll } = new UserController();

router.get('/', checkJwt, getAll);

export { router };
