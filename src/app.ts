import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { router } from './routes/index.route';
import MongoDbService from './services/mongo.service';

const app = express();
const PORT = process.env.PORT ?? 3001;
const ENV = process.env.NODE_ENV ?? 'development';
const mongoService = new MongoDbService();

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

void mongoService.connectDB();

try {
  app.listen(PORT, () => {
    console.log(`Server is running in ${ENV}  mode on port ${PORT}`);
  });
} catch (e) {
  console.log(e);
}
