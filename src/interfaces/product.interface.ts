import type { Color } from '../enums/product.enum';
import type { ObjectId } from 'mongodb';

export interface Ratings {
  star: number;
  postedBy: ObjectId;
}
export interface CreateProductDto {
  title: string;
  description: string | null;
  price: number;
  slug: string;
  brand: string | null;
  quantity: number;
  sold: number;
  images: string[];
  color: Color | null;
}
