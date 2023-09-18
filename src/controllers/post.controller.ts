import type { Request, Response } from 'express';
import { deleted, ok } from '../helpers/APIResponse.handle';
import type { HttpMessageResponse } from '../interfaces/httpMessageResponse.interface';
import type { ReqExtJwt } from '../interfaces/user.interface';
import { PostService } from '../services/post.service';

export class PostController<T extends Request, U extends Response> {
  async createOne({ body }: T, res: U): Promise<U> {
    try {
      const postService = new PostService();
      await postService.addPost(body);
      const response = ok('Post created');
      return res.status(response.code).send(response);
    } catch (err) {
      const typedError = err as HttpMessageResponse;
      return res.status(typedError.code).send(typedError);
    }
  }

  async getAll(_: T, res: U): Promise<U> {
    try {
      const postService = new PostService();
      const response = ok('Posts received', await postService.getPosts());
      return res.status(response.code).send(response);
    } catch (err) {
      const typedError = err as HttpMessageResponse;
      return res.status(typedError.code).send(typedError);
    }
  }

  async getOne({ params: { id } }: T, res: U): Promise<U> {
    try {
      const postService = new PostService();
      const response = ok('Post received', await postService.getPost(id));
      return res.status(response.code).send(response);
    } catch (err) {
      const typedError = err as HttpMessageResponse;
      return res.status(typedError.code).send(typedError);
    }
  }

  async updateOne({ params: { id }, body }: T, res: U): Promise<U> {
    try {
      const postService = new PostService();
      await postService.updatePost(id, body);
      const response = ok('Post updated');
      return res.status(response.code).send(response);
    } catch (err) {
      const typedError = err as HttpMessageResponse;
      return res.status(typedError.code).send(typedError);
    }
  }

  async deleteOne({ params: { id } }: T, res: U): Promise<U> {
    try {
      const postService = new PostService();
      await postService.deletePost(id);
      const response = deleted('Post removed');
      return res.status(response.code).send(response);
    } catch (err) {
      const typedError = err as HttpMessageResponse;
      return res.status(typedError.code).send(typedError);
    }
  }

  // async likePost({ body: { postId }, user }: ReqExtJwt, res: U): Promise<U> {
  //   try {
  //     const postService = new PostService();
  //     const messageResponse = await postService.likePost(postId, user?._id);
  //     const response = ok(messageResponse);
  //     return res.status(response.code).send(response);
  //   } catch (err) {
  //     const typedError = err as HttpMessageResponse;
  //     return res.status(typedError.code).send(typedError);
  //   }
  // }

  // async dislikePost({ body: { postId }, user }: ReqExtJwt, res: U): Promise<U> {
  //   try {
  //     const postService = new PostService();
  //     const messageResponse = await postService.dislikePost(postId, user?._id);
  //     const response = ok(messageResponse);
  //     return res.status(response.code).send(response);
  //   } catch (err) {
  //     const typedError = err as HttpMessageResponse;
  //     return res.status(typedError.code).send(typedError);
  //   }
  // }
}
