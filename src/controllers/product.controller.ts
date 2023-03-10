import type { Response } from 'express';
import type { ReqExtJwt } from '../interfaces/user.interface';
import { ProductService } from '../services/product.service';
import { created, ok, deleted } from '../helpers/APIResponse.handle';
import type { HttpMessageResponse } from '../interfaces/httpMessageResponse.interface';

export class ProductController<T extends ReqExtJwt, U extends Response> {
  async create({ body, user }: T, res: U): Promise<U> {
    try {
      const productService = new ProductService();
      const response = created('Product created', await productService.addProduct(body, user?._id));
      return res.status(response.code).send(response);
    } catch (err) {
      const typedError = err as HttpMessageResponse;
      return res.status(typedError.code).send(typedError);
    }
  }

  async getAll({ user }: T, res: U): Promise<U> {
    try {
      const productService = new ProductService();
      const response = ok('Products received', await productService.getProducts(user?._id));
      return res.status(response.code).send(response);
    } catch (err) {
      const typedError = err as HttpMessageResponse;
      return res.status(typedError.code).send(typedError);
    }
  }

  async getOne({ params: { id }, user }: T, res: U): Promise<U> {
    try {
      const productService = new ProductService();
      const response = ok('Product received', await productService.getProduct(id, user?._id));
      return res.status(response.code).send(response);
    } catch (err) {
      const typedError = err as HttpMessageResponse;
      return res.status(typedError.code).send(typedError);
    }
  }

  async updateOne({ params: { id }, body, user }: T, res: U): Promise<U> {
    try {
      const productService = new ProductService();
      await productService.updateProduct(id, body, user?._id);
      const response = ok('Product updated');
      return res.status(response.code).send(response);
    } catch (err) {
      const typedError = err as HttpMessageResponse;
      return res.status(typedError.code).send(typedError);
    }
  }

  async deleteOne({ params: { id }, user }: T, res: U): Promise<U> {
    try {
      const productService = new ProductService();
      await productService.deleteProduct(id, user?._id);
      const response = deleted('Product removed');
      return res.status(response.code).send(response);
    } catch (err) {
      const typedError = err as HttpMessageResponse;
      return res.status(typedError.code).send(typedError);
    }
  }
}
