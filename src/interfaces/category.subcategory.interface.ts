import type { ObjectId } from 'mongodb';

export interface Category {
  _id: ObjectId;
  title: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  _id: ObjectId;
  title: string;
  subcategories: Subcategory[];
}
