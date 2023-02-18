import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import { connectDB } from './config/mongo.config';
import { router } from './routes/index.route';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(morgan('dev'));
app.use(express.json());

app.use(router);

connectDB();

try {
  app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
  });
} catch (e) {
  console.log(e);
}
