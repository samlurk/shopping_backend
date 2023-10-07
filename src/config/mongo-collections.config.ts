import type CategoryModel from '../models/category.model';
import type PostModel from '../models/post.model';
import type UserModel from '../models/user.model';
import MongoDbService from '../services/mongo.service';
import type ProductModel from '../models/product.model';

const mongoService = new MongoDbService();

export const collections = {
  users: mongoService.getCollection<UserModel>('users'),
  products: mongoService.getCollection<ProductModel>('products'),
  posts: mongoService.getCollection<PostModel>('posts'),
  categories: mongoService.getCollection<CategoryModel>('categories')
};
