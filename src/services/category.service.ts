import { ObjectId } from 'mongodb';
import { collections } from '../config/mongo.config';
import { notFound } from '../helpers/APIResponse.handle';
import type { CreateCategoryDto } from '../interfaces/category.interface';
import CategoryModel from '../models/category.model';
import { handleReqQuery } from '../helpers/query.handle';
import type { ReqQueryDto } from '../interfaces/query.interface';

export default class CategoryService {
  async createOneCategory(createCategoryDto: CreateCategoryDto): Promise<void> {
    const categoryModel = new CategoryModel(createCategoryDto);
    await collections.categories?.insertOne(categoryModel);
  }

  async getOneCategory(categoryId: string, reqQuery: ReqQueryDto): Promise<CategoryModel> {
    const { project } = handleReqQuery(reqQuery);
    const responseCategory = await collections.categories
      ?.aggregate<CategoryModel>([{ $match: { _id: new ObjectId(categoryId) } }, { $project: project }])
      .toArray();
    if (responseCategory === undefined || responseCategory.length === 0) throw notFound('category/category-not-found');
    const [category] = responseCategory;
    return category;
  }

  async getAllCategories(reqQuery: ReqQueryDto): Promise<CategoryModel[]> {
    const { skip, limit, match, project, sort } = handleReqQuery(reqQuery);

    const responseCategory = await collections.categories
      ?.aggregate<CategoryModel>([
        { $sort: sort },
        { $skip: skip },
        { $limit: limit },
        { $match: match },
        { $project: project }
      ])
      .toArray();

    if (responseCategory === undefined || responseCategory.length === 0)
      throw notFound('category/all-categories/no-categories-found');
    return responseCategory;
  }

  async updateOneCategory(categoryId: string, updateCategory: Partial<CreateCategoryDto>): Promise<void> {
    const responseCategory = await collections.categories?.updateOne(
      { _id: new ObjectId(categoryId) },
      { $set: { ...updateCategory, updateAt: new Date() } }
    );
    if (responseCategory?.modifiedCount === 0) throw notFound('category/edit-category/category-not-found');
  }

  async deleteOneCategory(categoryId: string): Promise<void> {
    const responseCategory = await collections.categories?.deleteOne({ _id: new ObjectId(categoryId) });
    if (responseCategory?.deletedCount === 0) throw notFound('category/category-not-found');
  }
}
