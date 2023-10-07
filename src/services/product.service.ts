import { collections } from '../config/mongo-collections.config';
import { type DeleteResult, ObjectId, type InsertOneResult, type UpdateResult } from 'mongodb';
import { forbidden, notFound, serverError } from '../helpers/APIResponse.handle';
import ProductModel from '../models/product.model';
import type { CreateProductDto } from '../interfaces/product.interface';
import type { ReqQueryPagination, ReqQueryDto } from '../interfaces/query.interface';
import { handleReqQuery, limitingQueryByFields, sortingQueryByFields } from '../helpers/query.handle';
import { Query } from '../enums/query.enum';

// export class ProductService {
//   async addProduct(
//     { title, description, price, slug, brand, quantity, sold, images, color }: CreateProductDto,
//     vendorId: string
//   ): Promise<void> {
//     const searchRequiredKeys = await this.checkProductUniqueKeys({ slug });
//     if (searchRequiredKeys != null && searchRequiredKeys.slug === slug)
//       throw forbidden('The registered slug already exists');
//     const productModel = new ProductModel({
//       title,
//       description,
//       price,
//       slug,
//       brand,
//       quantity,
//       sold,
//       images,
//       color
//     });
//     await collections.products?.insertOne(productModel);
//   }

//   async checkProductUniqueKeys({ slug }: Pick<Product, 'slug'>): Promise<Pick<Product, 'slug'> | null> {
//     return (await collections.products?.findOne({ slug }, { projection: { slug: 1 } })) as Pick<Product, 'slug'> | null;
//   }

//   async getProducts(vendorId: string, reqQuery: ReqQueryDto): Promise<Product[] | undefined> {
//     const { skip, limit, match, project, sort } = handleReqQuery(reqQuery);
//     const totalCount = await collections.products?.countDocuments();
//     if (typeof totalCount === 'number' && skip >= totalCount) throw notFound('product/page-not-found');

//     const queryProduct = collections.products?.aggregate([
//       { $sort: sort },
//       { $skip: skip },
//       { $limit: limit },
//       {
//         $match: {
//           $and: [match, { createBy: new ObjectId(vendorId) }]
//         }
//       },
//       {
//         $lookup: {
//           from: 'categories',
//           localField: 'category._id',
//           foreignField: '_id',
//           as: 'category'
//         }
//       },
//       { $unwind: '$category' },
//       { $project: project }
//     ]);

//     const responseProduct = (await queryProduct?.toArray()) as Product[] | undefined;
//     if (responseProduct == null) throw notFound('No product registered');
//     return responseProduct;
//   }

//   async getProduct(productId: string, vendorId: string): Promise<Product | undefined> {
//     const [responseProduct] = (await collections.products
//       ?.aggregate([
//         {
//           $match: {
//             $and: [{ _id: new ObjectId(productId) }, { createBy: new ObjectId(vendorId) }]
//           }
//         },
//         {
//           $lookup: {
//             from: 'categories',
//             localField: 'category._id',
//             foreignField: '_id',
//             as: 'category'
//           }
//         },
//         { $unwind: '$category' }
//       ])
//       .toArray()) as Product[];
//     if (responseProduct == null) throw notFound('Product not found');
//     return responseProduct;
//   }

//   async deleteProduct(productId: string, vendorId: string): Promise<void> {
//     const responseProduct = await collections.products?.deleteOne({
//       $and: [{ _id: new ObjectId(productId) }, { createBy: new ObjectId(vendorId) }]
//     });
//     if (responseProduct?.deletedCount === 0) throw notFound('Product not found');
//   }

//   async updateProduct(productId: string, product: Product, vendorId: string): Promise<void> {
//     product.updateAt = new Date();
//     const responseProduct = await collections.products?.updateOne(
//       { $and: [{ _id: new ObjectId(productId) }, { createBy: new ObjectId(vendorId) }] },
//       { $set: product }
//     );
//     if (responseProduct?.matchedCount === 0) throw notFound('Product not found');
//   }
// }
