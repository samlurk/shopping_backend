import type { Request, Response } from 'express';
import { deleted, ok, serverError } from '../helpers/APIResponse.handle';
import type { HttpMessageResponse } from '../interfaces/httpMessageResponse.interface';
import CategoryService from '../services/category.service';
import type { CreateCategoryDto } from '../interfaces/category.interface';
import type { ParamsDictionary } from 'express-serve-static-core';

export default class CategoryController {
  async createOneCategory({ body }: Request<unknown, unknown, CreateCategoryDto>, res: Response): Promise<Response> {
    try {
      const categoryService = new CategoryService();
      await categoryService.createOneCategory(body);
      const response = ok('Category created');
      return res.status(response.code).send(response);
    } catch (err) {
      let typedError: HttpMessageResponse;
      if (err instanceof Error) {
        typedError = serverError(err.message);
        return res.status(typedError.code).send(typedError);
      } else typedError = err as HttpMessageResponse;
      return res.status(typedError.code).send(typedError);
    }
  }

  async getAllCategories(_: Request, res: Response): Promise<Response> {
    try {
      const categoryService = new CategoryService();
      const response = ok('Categories received', await categoryService.getAllCategories());
      return res.status(response.code).send(response);
    } catch (err) {
      let typedError: HttpMessageResponse;
      if (err instanceof Error) {
        typedError = serverError(err.message);
        return res.status(typedError.code).send(typedError);
      } else typedError = err as HttpMessageResponse;
      return res.status(typedError.code).send(typedError);
    }
  }

  async getOneCategory({ params: { id } }: Request, res: Response): Promise<Response> {
    try {
      const categoryService = new CategoryService();
      const response = ok('Category received', await categoryService.getOneCategory(id));
      return res.status(response.code).send(response);
    } catch (err) {
      let typedError: HttpMessageResponse;
      if (err instanceof Error) {
        typedError = serverError(err.message);
        return res.status(typedError.code).send(typedError);
      } else typedError = err as HttpMessageResponse;
      return res.status(typedError.code).send(typedError);
    }
  }

  async updateOneCategory(
    { params: { id }, body }: Request<ParamsDictionary, unknown, Partial<CreateCategoryDto>>,
    res: Response
  ): Promise<Response> {
    try {
      const categoryService = new CategoryService();
      await categoryService.updateOneCategory(id, body);
      const response = ok('Category updated');
      return res.status(response.code).send(response);
    } catch (err) {
      let typedError: HttpMessageResponse;
      if (err instanceof Error) {
        typedError = serverError(err.message);
        return res.status(typedError.code).send(typedError);
      } else typedError = err as HttpMessageResponse;
      return res.status(typedError.code).send(typedError);
    }
  }

  async deleteOneCategory({ params: { id } }: Request, res: Response): Promise<Response> {
    try {
      const categoryService = new CategoryService();
      await categoryService.deleteOneCategory(id);
      const response = deleted('Category removed');
      return res.status(response.code).send(response);
    } catch (err) {
      let typedError: HttpMessageResponse;
      if (err instanceof Error) {
        typedError = serverError(err.message);
        return res.status(typedError.code).send(typedError);
      } else typedError = err as HttpMessageResponse;
      return res.status(typedError.code).send(typedError);
    }
  }
}
