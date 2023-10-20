import { ObjectId } from 'mongodb';
import { forbidden, notFound } from '../helpers/api-response.helper';
import ProductModel from '../models/product.model';
import type { CreateProductDto } from '../interfaces/product.interface';
import { handleReqQuery } from '../helpers/query.helper';
import CategoryService from './category.service';
import { Type } from '../enums/category.enum';
import type CategoryModel from '../models/category.model';
import MongoDbService from './mongo.service';
import type { UpdateProductDto } from '../types/product.type';

export class ProductService {
  categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  async createOneProduct(vendorId: string, createProductDto: CreateProductDto): Promise<void> {
    const mongoDbService = new MongoDbService();
    const isSlugAlreadyExists = await mongoDbService.Collections.products.findOne({ slug: createProductDto.slug });
    if (isSlugAlreadyExists !== null) throw forbidden('product/product-slug-already-exists');

    const responseCategory = await this.categoryService.getAllCategories({
      or: [
        { _id: new ObjectId(createProductDto.category), type: Type.Product },
        { title: 'Uncategorized', type: Type.Product }
      ],
      fields: '_id'
    });

    const category =
      responseCategory.length === 2
        ? (responseCategory.find(({ _id }) => _id?.equals(createProductDto.category)) as CategoryModel)
        : responseCategory[0];

    const vendor = { _id: new ObjectId(vendorId) };
    const productModel = new ProductModel(createProductDto, vendor, category);
    await mongoDbService.Collections.products.insertOne(productModel);
    await mongoDbService.closeDB();
  }

  async getAllProducts(vendorId: string, reqQuery: object): Promise<ProductModel[]> {
    const mongoDbService = new MongoDbService();
    const { skip, limit, match, projection, sort } = handleReqQuery(reqQuery);

    const responseProduct = await mongoDbService.Collections.products
      .aggregate<ProductModel>([
        {
          $match: {
            $and: [match, { vendor: { _id: new ObjectId(vendorId) } }]
          }
        },
        { $sort: sort },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: 'categories',
            localField: 'category._id',
            foreignField: '_id',
            as: 'category'
          }
        },
        { $unwind: '$category' },
        {
          $lookup: {
            from: 'users',
            localField: 'vendor._id',
            foreignField: '_id',
            as: 'vendor'
          }
        },
        { $unwind: '$vendor' },
        {
          $addFields: {
            vendor: {
              $let: {
                vars: {
                  vendorArray: {
                    $map: {
                      input: { $objectToArray: '$vendor' },
                      as: 'property',
                      in: {
                        $cond: {
                          if: { $in: ['$$property.k', ['_id', 'firstName', 'lastName']] },
                          then: ['$$property.k', '$$property.v'],
                          else: null
                        }
                      }
                    }
                  }
                },
                in: {
                  $arrayToObject: {
                    $filter: {
                      input: '$$vendorArray',
                      as: 'property',
                      cond: { $ne: ['$$property', null] }
                    }
                  }
                }
              }
            },
            category: {
              $let: {
                vars: {
                  categoryArray: {
                    $map: {
                      input: { $objectToArray: '$category' },
                      as: 'property',
                      in: {
                        $cond: {
                          if: { $in: ['$$property.k', ['_id', 'title']] },
                          then: ['$$property.k', '$$property.v'],
                          else: null
                        }
                      }
                    }
                  }
                },
                in: {
                  $arrayToObject: {
                    $filter: {
                      input: '$$categoryArray',
                      as: 'property',
                      cond: { $ne: ['$$property', null] }
                    }
                  }
                }
              }
            }
          }
        },
        { $project: projection }
      ])
      .toArray();

    if (responseProduct.length === 0) throw notFound('product/all-products/no-product-found');
    await mongoDbService.closeDB();
    return responseProduct;
  }

  async getOneProduct(vendorId: string, reqQuery: object): Promise<ProductModel> {
    const mongoDbService = new MongoDbService();
    const { match, projection } = handleReqQuery(reqQuery);

    const [responseProduct] = await mongoDbService.Collections.products
      .aggregate<ProductModel>([
        {
          $match: {
            $and: [match, { vendor: { _id: new ObjectId(vendorId) } }]
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
        {
          $lookup: {
            from: 'users',
            localField: 'vendor._id',
            foreignField: '_id',
            as: 'vendor'
          }
        },
        { $unwind: '$vendor' },
        {
          $addFields: {
            vendor: {
              $let: {
                vars: {
                  vendorArray: {
                    $map: {
                      input: { $objectToArray: '$vendor' },
                      as: 'property',
                      in: {
                        $cond: {
                          if: { $in: ['$$property.k', ['_id', 'firstName', 'lastName']] },
                          then: ['$$property.k', '$$property.v'],
                          else: null
                        }
                      }
                    }
                  }
                },
                in: {
                  $arrayToObject: {
                    $filter: {
                      input: '$$vendorArray',
                      as: 'property',
                      cond: { $ne: ['$$property', null] }
                    }
                  }
                }
              }
            },
            category: {
              $let: {
                vars: {
                  categoryArray: {
                    $map: {
                      input: { $objectToArray: '$category' },
                      as: 'property',
                      in: {
                        $cond: {
                          if: { $in: ['$$property.k', ['_id', 'title']] },
                          then: ['$$property.k', '$$property.v'],
                          else: null
                        }
                      }
                    }
                  }
                },
                in: {
                  $arrayToObject: {
                    $filter: {
                      input: '$$categoryArray',
                      as: 'property',
                      cond: { $ne: ['$$property', null] }
                    }
                  }
                }
              }
            }
          }
        },
        { $project: projection }
      ])
      .toArray();
    if (responseProduct === null) throw notFound('product/product-not-found');
    await mongoDbService.closeDB();
    return responseProduct;
  }

  async deleteOneProduct(productId: string, vendorId: string): Promise<void> {
    const mongoDbService = new MongoDbService();
    const responseProduct = await mongoDbService.Collections.products.deleteOne({
      $and: [{ _id: new ObjectId(productId) }, { vendor: { _id: new ObjectId(vendorId) } }]
    });
    if (responseProduct.deletedCount === 0) throw notFound('product/product-not-found');
    await mongoDbService.removeAllReferences(
      mongoDbService.Collections.products.collectionName,
      new ObjectId(productId)
    );
    await mongoDbService.closeDB();
  }

  async updateOneProduct(
    productId: string,
    vendorId: string,
    { category: productCategory, slug: productSlug, ...updateProductDto }: UpdateProductDto
  ): Promise<void> {
    const mongoDbService = new MongoDbService();
    let productToUpdate;
    productToUpdate = { ...updateProductDto };

    if (productSlug !== undefined) {
      const isSlugAlreadyExists = await mongoDbService.Collections.products.findOne({ slug: productSlug });
      if (isSlugAlreadyExists !== null) throw forbidden('product/edit-product/product-slug-already-exists');
      productToUpdate = { ...updateProductDto, slug: productSlug };
    }

    if (productCategory !== undefined) {
      await this.categoryService.getOneCategory({
        _id: new ObjectId(productCategory),
        type: Type.Product
      });
      productToUpdate = { ...productToUpdate, category: { _id: new ObjectId(productCategory) } };
    }

    const responseProduct = await mongoDbService.Collections.products.updateOne(
      { $and: [{ _id: new ObjectId(productId) }, { vendor: { _id: new ObjectId(vendorId) } }] },
      { $set: { ...productToUpdate, updateAt: new Date() } }
    );
    if (responseProduct.matchedCount === 0) throw notFound('product/edit-product/product-not-found');
    await mongoDbService.closeDB();
  }
}
