import { collections } from '../config/mongo.config';
import { type DeleteResult, ObjectId, type InsertOneResult, type UpdateResult } from 'mongodb';
import { forbidden, notFound, serverError } from '../helpers/APIResponse.handle';
import ProductModel from '../models/product.model';
import type { Product } from '../interfaces/product.interface';
import type { queryPagination, reqQueryProduct } from '../interfaces/query.interface';
import { limitQueryFields, sortQueryProduct } from '../helpers/query.handle';
import { Query } from '../enums/query.enum';

export class ProductService {
  async addProduct(
    { title, description, price, slug, category, brand, quantity, sold, images, color, ratings, createBy }: Product,
    vendorId: string
  ): Promise<InsertOneResult> {
    const searchRequiredKeys = await this.checkProductUniqueKeys({ slug });
    if (searchRequiredKeys != null && searchRequiredKeys.slug === slug)
      throw forbidden('The registered slug already exists');
    createBy = new ObjectId(vendorId);
    const productModel = new ProductModel(
      title,
      description,
      price,
      slug,
      category,
      brand,
      quantity,
      sold,
      images,
      color,
      ratings,
      createBy
    );
    return (await collections.products?.insertOne(productModel)) as InsertOneResult;
  }

  async checkProductUniqueKeys({ slug }: Pick<Product, 'slug'>): Promise<Pick<Product, 'slug'> | null> {
    return (await collections.products?.findOne({ slug }, { projection: { slug: 1 } })) as Pick<Product, 'slug'> | null;
  }

  async getProducts(vendorId: string, reqQuery: reqQueryProduct): Promise<Product[] | undefined> {
    //* Filtering
    const queryStr = JSON.stringify(reqQuery)
      .replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
      .replace(/\W\d+\W/gm, (match) => match.slice(1, match.length - 1));

    //* Sorting
    const queryObject: reqQueryProduct = JSON.parse(queryStr);
    Object.keys(queryObject).forEach((key: string) => {
      if (key === Query.Page || key === Query.Sort || key === Query.Limit || key === Query.Fields)
        delete queryObject[key];
    });

    //* Limiting the fields && Pagination
    let pagination: queryPagination = { limit: 10, skip: 0 };
    if (typeof reqQuery.page === 'string' && typeof reqQuery.limit === 'string') {
      if (!Number.isNaN(reqQuery.limit) && !Number.isNaN(reqQuery.page)) {
        const page = parseInt(reqQuery.page);
        const limit = parseInt(reqQuery.limit);
        pagination = { limit, skip: (page - 1) * limit };
        const totalProductCount = await collections.products?.countDocuments();
        if (typeof totalProductCount === 'undefined') throw notFound('No product registered');
        if (pagination.skip >= totalProductCount) throw notFound("This page doesn't exists");
      }
    }

    const queryProduct = collections.products?.aggregate([
      { $sort: sortQueryProduct(reqQuery.sort) },
      { $skip: pagination.skip },
      { $limit: pagination.limit },
      {
        $match: {
          $and: [queryObject, { createBy: new ObjectId(vendorId) }]
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category._id',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      { $project: limitQueryFields(reqQuery.fields) }
    ]);

    const responseProduct = (await queryProduct?.toArray()) as Product[] | undefined;
    if (responseProduct == null) throw notFound('No product registered');
    return responseProduct;
  }

  async getProduct(productId: string, vendorId: string): Promise<Product | undefined> {
    const [responseProduct] = (await collections.products
      ?.aggregate([
        {
          $match: {
            $and: [{ _id: new ObjectId(productId) }, { createBy: new ObjectId(vendorId) }]
          }
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'category._id',
            foreignField: '_id',
            as: 'category'
          }
        },
        { $unwind: '$category' }
      ])
      .toArray()) as Product[];
    if (responseProduct == null) throw notFound('Product not found');
    return responseProduct;
  }

  async deleteProduct(productId: string, vendorId: string): Promise<DeleteResult> {
    const responseProduct = await collections.products?.deleteOne({
      $and: [{ _id: new ObjectId(productId) }, { createBy: new ObjectId(vendorId) }]
    });
    if (responseProduct?.deletedCount === 0) throw notFound('Product not found');
    if (responseProduct?.deletedCount == null) throw serverError('Unexpected Error');
    return responseProduct;
  }

  async updateProduct(productId: string, product: Product, vendorId: string): Promise<UpdateResult> {
    product.updateAt = new Date();
    const responseProduct = await collections.products?.updateOne(
      { $and: [{ _id: new ObjectId(productId) }, { createBy: new ObjectId(vendorId) }] },
      { $set: product }
    );
    if (responseProduct?.matchedCount === 0) throw notFound('Product not found');
    if (responseProduct?.matchedCount == null) throw serverError('Unexpected Error');
    return responseProduct;
  }
}
