import type { Color } from '../enums/product.enum';
import type { ObjectId } from 'mongodb';
import type { Category } from './category.interface';

export interface Ratings {
  star: number;
  postedBy: ObjectId;
}
export interface Product {
  title: string;
  description: string;
  price: number;
  slug: string;
  category?: Category;
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

export interface QueryProduct {
  search?: object;
  sort?: object;
  page?: number;
  limit?: number;
}
