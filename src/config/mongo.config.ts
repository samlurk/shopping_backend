import * as mongoDB from 'mongodb';
import 'dotenv/config';

export async function connectDB(): Promise<void> {
  const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING as string);

  await client.connect();

  const db: mongoDB.Db = client.db(process.env.DB_NAME);

  collections.users = db.collection('users');
  collections.products = db.collection('products');
  collections.productCategories = db.collection('product_categories');
  collections.productSubcategories = db.collection('product_subcategories');
  collections.posts = db.collection('posts');
  collections.postCategories = db.collection('post_categories');
  collections.postSubcategories = db.collection('post_subcategories');

  console.log(`Successfully connected to database: ${db.databaseName}`);
}

export const collections: {
  users?: mongoDB.Collection;
  products?: mongoDB.Collection;
  productCategories?: mongoDB.Collection;
  productSubcategories?: mongoDB.Collection;
  posts?: mongoDB.Collection;
  postCategories?: mongoDB.Collection;
  postSubcategories?: mongoDB.Collection;
} = {};
