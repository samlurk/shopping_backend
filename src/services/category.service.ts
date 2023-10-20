import { ObjectId } from 'mongodb';
import { notFound } from '../helpers/api-response.helper';
import type { CreateCategoryDto } from '../interfaces/category.interface';
import CategoryModel from '../models/category.model';
import { handleReqQuery } from '../helpers/query.helper';
import type { UpdateCategoryDto } from '../types/category.type';
import MongoDbService from './mongo.service';

export default class CategoryService {
  async createOneCategory(createCategoryDto: CreateCategoryDto): Promise<void> {
    const mongoDbService = new MongoDbService();
    const categoryModel = new CategoryModel(createCategoryDto);
    await mongoDbService.Collections.categories.insertOne(categoryModel);
    await mongoDbService.closeDB();
  }

  async getOneCategory(reqQuery: object): Promise<CategoryModel> {
    const mongoDbService = new MongoDbService();
    const { projection, match } = handleReqQuery(reqQuery);
    const responseCategory = await mongoDbService.Collections.categories.findOne(match, { projection });

    if (responseCategory === null) throw notFound('category/category-not-found');
    await mongoDbService.closeDB();
    return responseCategory;
  }

  async getAllCategories(reqQuery: object): Promise<CategoryModel[]> {
    const mongoDbService = new MongoDbService();
    const { skip, limit, match, projection, sort } = handleReqQuery(reqQuery);

    const responseCategory = await mongoDbService.Collections.categories
      .aggregate<CategoryModel>([
        { $sort: sort },
        { $skip: skip },
        { $limit: limit },
        { $match: match },
        { $project: projection }
      ])
      .toArray();

    if (responseCategory.length === 0) throw notFound('category/all-categories/no-categories-found');
    await mongoDbService.closeDB();
    return responseCategory;
  }

  async updateOneCategory(categoryId: string, updateCategory: UpdateCategoryDto): Promise<void> {
    const mongoDbService = new MongoDbService();
    const responseCategory = await mongoDbService.Collections.categories.updateOne(
      { _id: new ObjectId(categoryId) },
      { $set: { ...updateCategory, updateAt: new Date() } }
    );
    if (responseCategory.modifiedCount === 0) throw notFound('category/edit-category/category-not-found');
    await mongoDbService.closeDB();
  }

  async deleteOneCategory(categoryId: string): Promise<void> {
    const mongoDbService = new MongoDbService();
    const responseCategory = await mongoDbService.Collections.categories.deleteOne({
      _id: new ObjectId(categoryId)
    });
    if (responseCategory.deletedCount === 0) throw notFound('category/category-not-found');
    await mongoDbService.removeAllReferences(mongoDbService.Collections.users.collectionName, new ObjectId(categoryId));
    await mongoDbService.closeDB();
  }
}
