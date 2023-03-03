import type { ObjectId } from 'mongodb';

export interface Subcategory {
  _id: ObjectId;
  title: string;
  subcategories: Subcategory[];
}
