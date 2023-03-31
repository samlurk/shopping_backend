import { ObjectId } from 'mongodb';
import type { Ratings } from '../interfaces/product.interface';

// Declare the Schema of the Mongo model
export default class ProductModel {
  constructor(
    private readonly title: string,
    private readonly description: string,
    private readonly price: number,
    private readonly slug: string,
    private readonly category = { _id: new ObjectId('642381fe167de3293d9f2c5c') },
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
