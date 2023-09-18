import type { Color } from '../enums/product.enum';
import type { ObjectId } from 'mongodb';
import type { CreateCategoryDto } from './category.interface';

export interface Ratings {
  star: number;
  postedBy: ObjectId;
}
export interface Product {
  title: string;
  description: string;
  price: number;
  slug: string;
  brand?: string;
  quantity?: number;
  sold?: number;
  images?: string[];
  color?: Color;
  ratings?: Ratings;
  createBy: ObjectId;
  createAt: Date;
  updateAt: Date | 'never';
}
