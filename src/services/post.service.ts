import { ObjectId } from 'mongodb';
import { collections } from '../config/mongo.config';
import { notFound } from '../helpers/APIResponse.handle';
import type { CreatePostDto } from '../interfaces/post.interface';
import PostModel from '../models/post.model';
import CategoryService from './category.service';

export class PostService {
  async addPost(createPostDto: CreatePostDto): Promise<void> {
    const categoryService = new CategoryService();
    await categoryService.getOneCategory(createPostDto.category.id);
    const postModel = new PostModel(createPostDto);
    await collections.posts?.insertOne(postModel);
  }

  async getPosts(): Promise<CreatePostDto[]> {
    const responsePost = (await collections.posts
      ?.aggregate([
        { $match: {} },
        {
          $lookup: {
            from: 'post_categories',
            localField: 'category._id',
            foreignField: '_id',
            as: 'category'
          }
        },
        {
          $unwind: '$category'
        },
        {
          $set: {
            numViews: { $add: ['$numViews', 1] }
          }
        }
      ])
      .toArray()) as CreatePostDto[];
    if (responsePost.length === 0) throw notFound('post/all-posts/no-post-found');
    await collections.posts?.updateMany({}, { $inc: { numViews: 1 } });
    return responsePost;
  }

  async getPost(postId: string): Promise<PostModel> {
    const [responsePost] = (await collections.posts
      ?.aggregate([
        { $match: { _id: new ObjectId(postId) } },
        {
          $lookup: {
            from: 'post_categories',
            localField: 'category._id',
            foreignField: '_id',
            as: 'category'
          }
        },
        {
          $unwind: '$category'
        },
        {
          $set: {
            numViews: { $add: ['$numViews', 1] }
          }
        }
      ])
      .toArray()) as PostModel[];
    if (responsePost === undefined) throw notFound('post/post-not-found');
    await collections.posts?.updateOne({ _id: new ObjectId(postId) }, { $inc: { numViews: 1 } });
    return responsePost;
  }

  async deletePost(postId: string): Promise<void> {
    const responsePost = await collections.posts?.deleteOne({
      _id: new ObjectId(postId)
    });
    if (responsePost?.deletedCount === 0) throw notFound('post/post-not-found');
  }

  async updatePost(postId: string, post: object): Promise<void> {
    const responsePost = await collections.posts?.updateOne(
      { _id: new ObjectId(postId) },
      { $set: { ...post, updateAt: new Date() } }
    );
    if (responsePost?.matchedCount === 0) throw notFound('post/post-not-found');
  }

  // private async likesAndDislikesPostData(): Promise<Post> {
  //   const [responsePost] = (await collections.posts
  //     ?.aggregate([
  //       {
  //         $match: { _id: new ObjectId('64233db624811969668710da') }
  //       },
  //       {
  //         $project: {
  //           _id: 0,
  //           likes: {
  //             active: 1,
  //             likesBy: {
  //               $filter: {
  //                 input: '$likes.likesBy',
  //                 as: 'user',
  //                 cond: {
  //                   $eq: ['$$user', new ObjectId('63fa2b7c027156ae66591ec7')]
  //                 }
  //               }
  //             }
  //           },
  //           dislikes: {
  //             active: 1,
  //             dislikesBy: {
  //               $filter: {
  //                 input: '$dislikes.dislikesBy',
  //                 as: 'user',
  //                 cond: {
  //                   $eq: ['$$user', new ObjectId('63fa2b7c027156ae66591ec7')]
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       }
  //     ])
  //     .toArray()) as Post[];
  //   if (responsePost === undefined) throw notFound('Post not found');
  //   return responsePost;
  // }

  // async likePost(postId: string, userId: string): Promise<string> {
  //   const { likes, dislikes } = await this.likesAndDislikesPostData();
  //   if (!likes.active && !dislikes.active) throw notFound('Likes and dislikes are not enabled for this post');

  //   // If you have disliked
  //   if (dislikes.dislikesBy[0] !== undefined) {
  //     await collections.posts?.updateOne(
  //       { _id: new ObjectId(postId) },
  //       {
  //         $pull: { 'dislikes.dislikesBy': { $eq: new ObjectId(userId) } },
  //         $push: { 'likes.likesBy': new ObjectId(userId) }
  //       }
  //     );
  //     return 'Post liked';
  //   }

  //   // If already liked
  //   if (likes.likesBy[0] !== undefined) {
  //     await collections.posts?.updateOne(
  //       { _id: new ObjectId(postId) },
  //       { $pull: { 'likes.likesBy': { $eq: new ObjectId(userId) } } }
  //     );
  //     return 'Like removed';
  //   }

  //   // If you have not liked
  //   if (likes.likesBy[0] === undefined) {
  //     await collections.posts?.updateOne(
  //       { _id: new ObjectId(postId) },
  //       { $push: { 'likes.likesBy': new ObjectId(userId) } }
  //     );
  //   }
  //   return 'Post liked';
  // }

  // async dislikePost(postId: string, userId: string): Promise<string> {
  //   const { likes, dislikes } = await this.likesAndDislikesPostData();
  //   if (!likes.active && !dislikes.active) throw notFound('Likes and dislikes are not enabled for this post');

  //   // If you have liked
  //   if (likes.likesBy[0] !== undefined) {
  //     await collections.posts?.updateOne(
  //       { _id: new ObjectId(postId) },
  //       {
  //         $pull: { 'likes.likesBy': { $eq: new ObjectId(userId) } },
  //         $push: { 'dislikes.dislikesBy': new ObjectId(userId) }
  //       }
  //     );
  //     return 'Post disliked';
  //   }

  //   // If already disliked
  //   if (dislikes.dislikesBy[0] !== undefined) {
  //     await collections.posts?.updateOne(
  //       { _id: new ObjectId(postId) },
  //       { $pull: { 'dislikes.dislikesBy': { $eq: new ObjectId(userId) } } }
  //     );
  //     return 'Dislike removed';
  //   }

  //   // If you have not disliked
  //   if (dislikes.dislikesBy[0] === undefined) {
  //     await collections.posts?.updateOne(
  //       { _id: new ObjectId(postId) },
  //       { $push: { 'dislikes.dislikesBy': new ObjectId(userId) } }
  //     );
  //   }
  //   return 'Post disliked';
  // }
}
