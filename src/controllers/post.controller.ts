import type { Request, Response } from 'express';
import { deleted, ok, serverError } from '../helpers/api-response.helper';
import type { HttpMessageResponse } from '../interfaces/httpMessageResponse.interface';
import type { ReqJwt } from '../interfaces/user.interface';
import { PostService } from '../services/post.service';
import type { CreatePostDto } from '../interfaces/post.interface';
import type { ReqQueryDto } from '../interfaces/query.interface';
import type { ParamsDictionary } from 'express-serve-static-core';
import { ObjectId } from 'mongodb';
import type { UpdatePostDto } from '../types/post.type';

export class PostController {
  async createOne({ user, body }: Request<unknown, unknown, CreatePostDto> & ReqJwt, res: Response): Promise<Response> {
    try {
      const postService = new PostService();
      await postService.createOnePost(user?._id, body);
      const response = ok('Post created');
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
    { query }: Request<unknown, unknown, unknown, ReqQueryDto & qs.ParsedQs>,
    res: Response
  ): Promise<Response> {
    try {
      const postService = new PostService();
      const response = ok('Posts received', await postService.getAllPosts(query));
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

  async getOne(
    { params: { id }, query }: Request<ParamsDictionary, unknown, unknown, ReqQueryDto & qs.ParsedQs>,
    res: Response
  ): Promise<Response> {
    try {
      const postService = new PostService();
      const response = ok('Post received', await postService.getOnePost({ _id: new ObjectId(id), ...query }));
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
    { params: { id }, body }: Request<ParamsDictionary, unknown, UpdatePostDto>,
    res: Response
  ): Promise<Response> {
    try {
      const postService = new PostService();
      await postService.updateOnePost(id, body);
      const response = ok('Post updated');
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

  async deleteOne({ params: { id } }: Request, res: Response): Promise<Response> {
    try {
      const postService = new PostService();
      await postService.deleteOnePost(id);
      const response = deleted('Post removed');
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

  async likePost({ body: { postId }, user }: Request & ReqJwt, res: Response): Promise<Response> {
    try {
      const postService = new PostService();
      const messageResponse = await postService.likePost(postId, user?._id);
      const response = ok(messageResponse);
      return res.status(response.code).send(response);
    } catch (err) {
      const typedError = err as HttpMessageResponse;
      return res.status(typedError.code).send(typedError);
    }
  }

  async dislikePost({ body: { postId }, user }: Request & ReqJwt, res: Response): Promise<Response> {
    try {
      const postService = new PostService();
      const messageResponse = await postService.dislikePost(postId, user?._id);
      const response = ok(messageResponse);
      return res.status(response.code).send(response);
    } catch (err) {
      const typedError = err as HttpMessageResponse;
      return res.status(typedError.code).send(typedError);
    }
  }
}
