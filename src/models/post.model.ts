import { ObjectId, type WithId } from 'mongodb';
import type { CreatePostDto } from '../interfaces/post.interface';
import type CategoryModel from './category.model';

export default class PostModel {
  title: string;
  description: string;
  category: ObjectId | WithId<CategoryModel>;
  image: string | null;
  interactions: boolean;
  likes: ObjectId[];
  dislikes: ObjectId[];
  author: ObjectId | WithId<PostModel>;
  numViews: number;
  createAt: Date;
  updateAt: Date;

  constructor({ title, description, category, image = null, interactions = true }: CreatePostDto, author: string) {
    this.title = title;
    this.description = description;
    this.category = new ObjectId(category);
    this.image = image;
    this.interactions = interactions;
    this.likes = [];
    this.dislikes = [];
    this.author = new ObjectId(author);
    this.numViews = 0;
    this.createAt = new Date();
    this.updateAt = new Date();
  }
}
