import { ObjectId } from 'mongodb';
import { collections } from '../config/mongo-collections.config';
import { notFound } from '../helpers/APIResponse.handle';
import type { CreateCategoryDto } from '../interfaces/category.interface';
import CategoryModel from '../models/category.model';
import { handleReqQuery } from '../helpers/query.handle';
import type { UpdateCategoryDto } from '../types/category.type';
import MongoDbService from './mongo.service';

export default class CategoryService {
  mongoService: MongoDbService;

  constructor() {
    this.mongoService = new MongoDbService();
  }

  async createOneCategory(createCategoryDto: CreateCategoryDto): Promise<void> {
    const categoryModel = new CategoryModel(createCategoryDto);
    await collections.categories.insertOne(categoryModel);
  }

  async getOneCategory(reqQuery: object): Promise<CategoryModel> {
    const { projection, match } = handleReqQuery(reqQuery);
    const responseCategory = await collections.categories.findOne(match, { projection });

    if (responseCategory === null) throw notFound('category/category-not-found');
    return responseCategory;
  }

  async getAllCategories(reqQuery: object): Promise<CategoryModel[]> {
    const { skip, limit, match, projection, sort } = handleReqQuery(reqQuery);

    const responseCategory = await collections.categories
      .aggregate<CategoryModel>([
        { $sort: sort },
        { $skip: skip },
        { $limit: limit },
        { $match: match },
        { $project: projection }
      ])
      .toArray();

    if (responseCategory.length === 0) throw notFound('category/all-categories/no-categories-found');
    return responseCategory;
  }

  async updateOneCategory(categoryId: string, updateCategory: UpdateCategoryDto): Promise<void> {
    const responseCategory = await collections.categories.updateOne(
      { _id: new ObjectId(categoryId) },
      { $set: { ...updateCategory, updateAt: new Date() } }
    );
    if (responseCategory.modifiedCount === 0) throw notFound('category/edit-category/category-not-found');
  }

  async deleteOneCategory(categoryId: string): Promise<void> {
    const responseCategory = await collections.categories.deleteOne({ _id: new ObjectId(categoryId) });
    if (responseCategory.deletedCount === 0) throw notFound('category/category-not-found');
    await this.mongoService.remove(collections.users.collectionName, new ObjectId(categoryId));
  }
}
