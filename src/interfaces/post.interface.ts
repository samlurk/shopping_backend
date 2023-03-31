import type { ObjectId } from 'mongodb';
import type { Category } from './category.subcategory.interface';

export interface Post {
  title: string;
  description: string;
  category: Category;
  image: string;
  likes: PostLikes;
  dislikes: PostDislikes;
  numViews: number;
  createAt: Date;
  updateAt: Date | 'never';
}

export interface PostLikes {
  active: false;
  likesBy: ObjectId[];
}
export interface PostDislikes {
  active: false;
  dislikesBy: ObjectId[];
}
