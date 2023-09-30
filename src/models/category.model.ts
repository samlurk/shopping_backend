import type { ObjectId } from 'mongodb';
import type { Type } from '../enums/category.enum';
import type { CreateCategoryDto } from '../interfaces/category.interface';

export default class CategoryModel {
  _id?: ObjectId;
  title: string;
  type: Type;
  createAt: Date;
  updateAt: Date;

  constructor({ title, type }: CreateCategoryDto) {
    this.title = title;
    this.type = type;
    this.createAt = new Date();
    this.updateAt = new Date();
  }
}
