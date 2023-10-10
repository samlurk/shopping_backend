import type { CreateProductDto, Ratings } from '../interfaces/product.interface';
import type { Color } from '../enums/product.enum';
import type UserModel from './user.model';
import type { ObjectId } from 'mongodb';
import type CategoryModel from './category.model';

// Declare the Schema of the Mongo model
export default class ProductModel {
  _id?: ObjectId;
  title: string;
  description: string | null;
  price: number;
  slug: string;
  category: Partial<CategoryModel>;
  brand: string | null;
  quantity: number;
  sold: number;
  images: string[];
  color: Color | null;
  ratings: Ratings[];
  vendor: Partial<UserModel>;
  createAt: Date;
  updateAt: Date;

  constructor(
    {
      title,
      description = null,
      price,
      slug,
      brand = null,
      quantity,
      sold = 0,
      color = null,
      images = []
    }: CreateProductDto,
    vendor: Pick<UserModel, '_id'>,
    category: Pick<CategoryModel, '_id'>
  ) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.slug = slug;
    this.category = category;
    this.brand = brand;
    this.quantity = quantity;
    this.sold = sold;
    this.color = color;
    this.images = images;
    this.ratings = [];
    this.vendor = vendor;
    this.createAt = new Date();
    this.updateAt = new Date();
  }
}
