import { ObjectId, type WithId } from 'mongodb';
import type { CreatePostDto } from '../interfaces/post.interface';
import type CategoryModel from './category.model';

export default class PostModel {
  title: string;
  description: string;
  category: Partial<WithId<CategoryModel>>;
  image: string | null;
  interactions: boolean;
  likes: ObjectId[];
  dislikes: ObjectId[];
  author: string;
  numViews: number;
  createAt: Date;
  updateAt: Date;

  constructor({ title, description, category: { id }, image = null }: CreatePostDto) {
    this.title = title;
    this.description = description;
    this.category = { _id: new ObjectId(id) };
    this.image = image;
    this.interactions = false;
    this.likes = [];
    this.dislikes = [];
    this.author = 'admin';
    this.numViews = 0;
    this.createAt = new Date();
    this.updateAt = new Date();
  }
}
