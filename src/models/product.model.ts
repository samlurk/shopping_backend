import type { ObjectId } from 'mongodb';
import type { Ratings } from '../interfaces/product.interface';
import type { Category } from '../interfaces/category.interface';

// Declare the Schema of the Mongo model
export default class ProductModel {
  constructor(
    private readonly title: string,
    private readonly description: string,
    private readonly price: number,
    private readonly slug: string,
    private readonly category?: Category,
    private readonly brand?: string,
    private readonly quantity?: number,
    private readonly sold: number = 0,
    private readonly images?: string[],
    private readonly color?: string,
    private readonly ratings?: Ratings,
    private readonly createBy?: ObjectId,
    private readonly createAt = new Date(),
    private readonly updateAt: Date | 'never' = 'never'
  ) {}
}
