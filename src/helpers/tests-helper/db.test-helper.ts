import { MongoMemoryServer } from 'mongodb-memory-server';
import MongoDbService from '../../services/mongo.service';

const mongoServer = new MongoMemoryServer({
  binary: { version: process.env.MONGOMS_VERSION, downloadDir: process.env.MONGOMS_DOWNLOAD_DIR }
});

const connect = async (): Promise<void> => {
  await mongoServer.start();
  const mongoUri = mongoServer.getUri();
  process.env.DB_CONN_STRING = mongoUri;
};

const close = async (): Promise<void> => {
  await mongoServer.stop();
};

const clear = async (): Promise<void> => {
  const mongoDbService = new MongoDbService();
  await mongoDbService.clearDB();
};

export default { connect, clear, close };
