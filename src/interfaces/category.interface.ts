import type { ObjectId } from 'mongodb';
import type { Subcategory } from './subcategory.interface';

export interface Category {
  _id: ObjectId;
  title: string;
  subcategories: Subcategory[];
}
