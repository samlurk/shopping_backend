import { ObjectId } from 'mongodb';
import { collections } from '../config/mongo.config';
import { notFound } from '../helpers/APIResponse.handle';
import type { CreateCategoryDto } from '../interfaces/category.interface';
import CategoryModel from '../models/category.model';

export default class CategoryService {
  async createOneCategory(createCategoryDto: CreateCategoryDto): Promise<void> {
    const categoryModel = new CategoryModel(createCategoryDto);
    await collections.categories?.insertOne(categoryModel);
  }

  async getOneCategory(categoryId: string): Promise<CategoryModel> {
    const responseCategory = await collections.categories?.findOne({ _id: new ObjectId(categoryId) });
    if (responseCategory === undefined || responseCategory === null) throw notFound('category/category-not-found');
    return responseCategory;
  }

  async getAllCategories(): Promise<CategoryModel[]> {
    const responseCategory = collections.categories
      ?.find({})
      .map((doc) => doc)
      .toArray();
    if (responseCategory === undefined || (await responseCategory).length === 0)
      throw notFound('category/all-categories/no-categories-found');
    return await responseCategory;
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
