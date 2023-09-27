import * as mongoDB from 'mongodb';
import 'dotenv/config';
import type CategoryModel from '../models/category.model';
import type PostModel from '../models/post.model';
import type UserModel from '../models/user.model';

export async function connectDB(): Promise<void> {
  const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING as string);

  await client.connect();

  const db: mongoDB.Db = client.db(process.env.DB_NAME);

  collections.users = db.collection('users');
  collections.products = db.collection('products');
  collections.posts = db.collection('posts');
  collections.categories = db.collection('categories');

  console.log(`Successfully connected to database: ${db.databaseName}`);
}

export const collections: {
  users?: mongoDB.Collection<UserModel>;
  products?: mongoDB.Collection;
  posts?: mongoDB.Collection<PostModel>;
  categories?: mongoDB.Collection<CategoryModel>;
} = {};
