import { Router } from 'express';
import { readDir } from '../utils/dynamic.import.handle';

const router = Router();

(async () => {
  (await readDir(__dirname).then((value) => {
    const files = value;
    files.filter(async (file) => {
      await import(`./${file}.route`).then((moduleRouter) => {
        console.log(`Route /${file} is loading...`);
        router.use(`/${file}`, moduleRouter.router);
      });
    });
  })) as string[];
})().catch((err) => err);

export { router };
