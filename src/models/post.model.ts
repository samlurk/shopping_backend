import type { ObjectId } from 'mongodb';
import type { CreatePostDto } from '../interfaces/post.interface';
import type CategoryModel from './category.model';
import type UserModel from './user.model';

export default class PostModel {
  _id?: ObjectId;
  title: string;
  description: string;
  category: Partial<CategoryModel>;
  image: string | null;
  interactions: boolean;
  likes: Array<Partial<UserModel>>;
  dislikes: Array<Partial<UserModel>>;
  author: Partial<UserModel>;
  numViews: number;
  createAt: Date;
  updateAt: Date;

  constructor(
    { title, description, image = null, interactions = true }: Omit<CreatePostDto, 'category'>,
    category: Pick<CategoryModel, '_id'>,
    author: Pick<UserModel, '_id'>
  ) {
    this.title = title;
    this.description = description;
    this.category = category;
    this.image = image;
    this.interactions = interactions;
    this.likes = [];
    this.dislikes = [];
    this.author = author;
    this.numViews = 0;
    this.createAt = new Date();
    this.updateAt = new Date();
  }
}
