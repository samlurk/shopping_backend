import { Router } from 'express';
import authRoutes from './auth.route';
import userRoutes from './user.route';
import categoryRoutes from './category.route';
import productRoutes from './product.route';
import postRoutes from './post.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/category', categoryRoutes);
router.use('/product', productRoutes);
router.use('/post', postRoutes);

export default router;
