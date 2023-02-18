import * as mongoDB from 'mongodb';
import 'dotenv/config';

export async function connectDB() {
  const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING as string);

  await client.connect();

  const db: mongoDB.Db = client.db(process.env.DB_NAME);

  const usersCollection: mongoDB.Collection = db.collection(process.env.USERS_COLLECTION_NAME as string);

  collections.users = usersCollection;

  console.log(
    `Successfully connected to database: ${db.databaseName} and collection: ${usersCollection.collectionName}`
  );
}

export const collections: { users?: mongoDB.Collection } = {};
