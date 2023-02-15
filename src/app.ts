import 'dotenv/config';
import express from 'express';
import db from './config/mongo.config';
import { router } from './routes/index.route';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(router);
db()
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch(() => {
    console.log('Database error connection');
  });

try {
  app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
  });
} catch (e) {
  console.log(e);
}
