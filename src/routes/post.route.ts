import { Router } from 'express';
import { PostController } from '../controllers/post.controller';
import { Role } from '../enums/user.enum';
import { authRoleMiddleware, authSessionMiddleware } from '../middlewares/auth.middleware';
import { validateId } from '../validators/param.validator';
import { validateCreatePost, validateUpdatePost, validatePostId } from '../validators/post.validator';

const router = Router();
const { createOne, getAll, getOne, updateOne, deleteOne } = new PostController();

router.post('/', authSessionMiddleware, authRoleMiddleware(Role.Admin), validateCreatePost, createOne);

router.get('/all-posts', authSessionMiddleware, authRoleMiddleware(Role.Admin), getAll);
router.get('/:id', authSessionMiddleware, authRoleMiddleware(Role.Admin), validateId, getOne);
router.put(
  '/edit-post/:id',
  authSessionMiddleware,
  authRoleMiddleware(Role.Admin),
  validateId,
  validateUpdatePost,
  updateOne
);
router.delete('/:id', authSessionMiddleware, authRoleMiddleware(Role.Admin), validateId, deleteOne);

// router.put('/like', authSessionMiddleware, authRoleMiddleware(Role.Admin), validatePostId, likePost);
// router.put('/dislike', authSessionMiddleware, authRoleMiddleware(Role.Admin), validatePostId, dislikePost);
export { router };
