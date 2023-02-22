import { Router, type Request, type Response } from 'express';
import { UserController } from '../controllers/user.controller';
import { checkJwt } from '../middlewares/session.middleware';

const router = Router();

const { getAll, getOne, create, updateOne, deleteOne } = new UserController();

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', create);
router.put('/:id', updateOne);
router.delete('/:id', deleteOne);
export { router };
