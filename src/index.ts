import app from './app';
import MongoDbService from './services/mongo.service';

const PORT = process.env.PORT ?? 3001;
const ENV = process.env.NODE_ENV ?? 'development';
const mongoService = new MongoDbService();

void mongoService.connectDB();

try {
  app.listen(PORT, () => {
    console.log(`Server is running in ${ENV} mode on port ${PORT}`);
  });
} catch (err) {
  console.log(err);
}
