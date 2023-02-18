import { Router, type Request, type Response } from 'express';

const router = Router();

router.get('/', (req, res) => {
  return res.send('Hello world');
});

export { router };
