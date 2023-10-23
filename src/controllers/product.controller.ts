import type { Response, Request } from 'express';
import type { ReqJwt } from '../interfaces/auth.interface';
import { created, ok, deleted, serverError } from '../helpers/api-response.helper';
import type { HttpMessageResponse } from '../interfaces/httpMessageResponse.interface';
import type { ReqQueryDto } from '../interfaces/query.interface';
import { ProductService } from '../services/product.service';
import type { ParamsDictionary } from 'express-serve-static-core';
import type { UpdateProductDto } from '../types/product.type';
import type { CreateProductDto } from '../interfaces/product.interface';

export class ProductController {
  async createOne(
    { body, user }: Request<ParamsDictionary, unknown, CreateProductDto> & ReqJwt,
    res: Response
  ): Promise<Response> {
    try {
      const productService = new ProductService();
      await productService.createOneProduct(user?._id, body);
      const response = created('Product created');
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

  async getAll(
    { user, query }: Request<unknown, unknown, unknown, ReqQueryDto & qs.ParsedQs> & ReqJwt,
    res: Response
  ): Promise<Response> {
    try {
      const productService = new ProductService();
      const response = ok('Products received', await productService.getAllProducts(user?._id, query));
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

  async getOne({ params: { id }, user }: Request & ReqJwt, res: Response): Promise<Response> {
    try {
      const productService = new ProductService();
      const response = ok('Product received', await productService.getOneProduct(user?._id, { _id: id }));
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

  async updateOne(
    { params: { id }, body, user }: Request<ParamsDictionary, unknown, UpdateProductDto> & ReqJwt,
    res: Response
  ): Promise<Response> {
    try {
      const productService = new ProductService();
      await productService.updateOneProduct(id, user?._id, body);
      const response = ok('Product updated');
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

  async deleteOne({ params: { id }, user }: Request & ReqJwt, res: Response): Promise<Response> {
    try {
      const productService = new ProductService();
      await productService.deleteOneProduct(id, user?._id);
      const response = deleted('Product removed');
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
