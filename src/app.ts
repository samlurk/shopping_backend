import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import routes from './routes/index.route';
import morgan from 'morgan';

const app = express();

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', routes);

export default app;
