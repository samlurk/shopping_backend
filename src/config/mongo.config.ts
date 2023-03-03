import * as mongoDB from 'mongodb';
import 'dotenv/config';

export async function connectDB(): Promise<void> {
  const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING as string);

  await client.connect();

  const db: mongoDB.Db = client.db(process.env.DB_NAME);

  collections.users = db.collection('users');
  collections.products = db.collection('products');
  collections.categories = db.collection('categories');
  collections.subcategories = db.collection('subcategories');

  console.log(`Successfully connected to database: ${db.databaseName}`);
}

export const collections: {
  users?: mongoDB.Collection;
  products?: mongoDB.Collection;
  categories?: mongoDB.Collection;
  subcategories?: mongoDB.Collection;
} = {};
