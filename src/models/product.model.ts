import type { WithId } from 'mongodb';
import type { CreateProductDto, Ratings } from '../interfaces/product.interface';
import type { Color } from '../enums/product.enum';
import type UserModel from './user.model';

// Declare the Schema of the Mongo model
export default class ProductModel {
  title: string;
  description: string | null;
  price: number;
  slug: string;
  brand: string | null;
  quantity: number;
  sold: number;
  images: string[];
  color: Color | null;
  ratings: Ratings[];
  vendor: WithId<UserModel>;
  createAt: Date;
  updateAt: Date;

  constructor({
    title,
    description = null,
    price,
    slug,
    brand = null,
    quantity,
    sold,
    color = null,
    images = []
  }: CreateProductDto) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.slug = slug;
    this.brand = brand;
    this.quantity = quantity;
    this.sold = sold;
    this.color = color;
    this.images = images;
    this.ratings = [];
    this.createAt = new Date();
    this.updateAt = new Date();
  }
}
// private readonly title: string,
// private readonly description: string,
// private readonly price: number,
// private readonly slug: string,
// private readonly brand?: string,
// private readonly quantity?: number,
// private readonly sold: number = 0,
// private readonly images?: string[],
// private readonly color?: string,
// private readonly ratings?: Ratings,
// private readonly createBy?: ObjectId,
// private readonly createAt = new Date(),
// private readonly updateAt: Date | 'never' = 'never'
