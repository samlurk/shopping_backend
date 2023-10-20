import { MongoMemoryServer } from 'mongodb-memory-server';

const mongoServer = new MongoMemoryServer({
  binary: { version: process.env.MONGOMS_VERSION, downloadDir: process.env.MONGOMS_VERSION }
});

const connect = async (): Promise<void> => {
  await mongoServer.start();
  const mongoUri = mongoServer.getUri();
  process.env.DB_CONN_STRING = mongoUri;
};

const close = async (): Promise<void> => {
  await mongoServer.stop();
};

export default { connect, close };
