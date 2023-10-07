import { ObjectId } from 'mongodb';
import { collections } from '../config/mongo-collections.config';
import { notFound } from '../helpers/APIResponse.handle';
import type { CreatePostDto } from '../interfaces/post.interface';
import PostModel from '../models/post.model';
import CategoryService from './category.service';
import { Type } from '../enums/category.enum';
import { UserService } from './user.service';
import type CategoryModel from '../models/category.model';
import { handleReqQuery } from '../helpers/query.handle';
import type { UpdatePostDto } from '../types/post.type';
import MongoDbService from './mongo.service';

export class PostService {
  mongoService: MongoDbService;
  categoryService: CategoryService;
  userService: UserService;

  constructor() {
    this.mongoService = new MongoDbService();
    this.categoryService = new CategoryService();
    this.userService = new UserService();
  }

  async addPost(author: string, createPostDto: CreatePostDto): Promise<void> {
    // if it finds the category, if it doesn't find it, it places a default one and if it doesn't exist, it throws an error.
    const responseCategory = await this.categoryService.getAllCategories({
      or: [{ _id: new ObjectId(createPostDto.category) }, { title: 'Uncategorized', type: Type.Post }],
      fields: '_id'
    });
    const category =
      responseCategory.length === 2
        ? (responseCategory.find(({ _id }) => _id?.toString() === createPostDto.category) as CategoryModel)
        : responseCategory[0];
    const responseUser = await this.userService.getOneUser({ _id: new ObjectId(author), fields: '_id' });
    const postModel = new PostModel(createPostDto, category, responseUser);
    await collections.posts.insertOne(postModel);
  }

  async getPosts(reqQuery: object): Promise<PostModel[]> {
    const { skip, limit, match, projection, sort } = handleReqQuery(reqQuery);

    const responsePost = await collections.posts
      .aggregate<PostModel>([
        { $match: match },
        { $sort: sort },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: 'categories',
            localField: 'category._id',
            foreignField: '_id',
            as: 'category'
          }
        },
        {
          $unwind: '$category'
        },
        {
          $lookup: {
            from: 'users',
            localField: 'author._id',
            foreignField: '_id',
            as: 'author'
          }
        },
        {
          $unwind: '$author'
        },
        {
          $lookup: {
            from: 'users',
            localField: 'dislikes._id',
            foreignField: '_id',
            as: 'dislikes'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'likes._id',
            foreignField: '_id',
            as: 'likes'
          }
        },
        {
          $addFields: {
            author: {
              $let: {
                vars: {
                  authorArray: {
                    $map: {
                      input: { $objectToArray: '$author' },
                      as: 'property',
                      in: {
                        $cond: {
                          if: { $in: ['$$property.k', ['_id', 'firstName', 'lastName']] },
                          then: ['$$property.k', '$$property.v'],
                          else: null
                        }
                      }
                    }
                  }
                },
                in: {
                  $arrayToObject: {
                    $filter: {
                      input: '$$authorArray',
                      as: 'property',
                      cond: { $ne: ['$$property', null] }
                    }
                  }
                }
              }
            },
            category: {
              $let: {
                vars: {
                  categoryArray: {
                    $map: {
                      input: { $objectToArray: '$category' },
                      as: 'property',
                      in: {
                        $cond: {
                          if: { $in: ['$$property.k', ['_id', 'title']] },
                          then: ['$$property.k', '$$property.v'],
                          else: null
                        }
                      }
                    }
                  }
                },
                in: {
                  $arrayToObject: {
                    $filter: {
                      input: '$$categoryArray',
                      as: 'property',
                      cond: { $ne: ['$$property', null] }
                    }
                  }
                }
              }
            },
            likes: {
              $let: {
                vars: {
                  likesArray: {
                    $map: {
                      input: '$likes',
                      as: 'like',
                      in: {
                        _id: '$$like._id',
                        firstName: '$$like.firstName',
                        lastName: '$$like.lastName'
                      }
                    }
                  }
                },
                in: '$$likesArray'
              }
            },
            dislikes: {
              $let: {
                vars: {
                  dislikesArray: {
                    $map: {
                      input: '$dislikes',
                      as: 'dislike',
                      in: {
                        _id: '$$dislike._id',
                        firstName: '$$dislike.firstName',
                        lastName: '$$dislike.lastName'
                      }
                    }
                  }
                },
                in: '$$dislikesArray'
              }
            }
          }
        },
        {
          $set: {
            numViews: { $add: ['$numViews', 1] }
          }
        },
        { $project: projection }
      ])
      .toArray();
    if (responsePost.length === 0) throw notFound('post/all-posts/no-post-found');
    await collections.posts?.updateMany(match, { $inc: { numViews: 1 }, $set: { updateAt: new Date() } });
    return responsePost;
  }

  async getPost(reqQuery: object): Promise<PostModel> {
    const { match, projection } = handleReqQuery(reqQuery);

    const [responsePost] = (await collections.posts
      ?.aggregate([
        { $match: match },
        {
          $lookup: {
            from: 'categories',
            localField: 'category._id',
            foreignField: '_id',
            as: 'category'
          }
        },
        {
          $unwind: '$category'
        },
        {
          $lookup: {
            from: 'users',
            localField: 'author._id',
            foreignField: '_id',
            as: 'author'
          }
        },
        {
          $unwind: '$author'
        },
        {
          $lookup: {
            from: 'users',
            localField: 'dislikes._id',
            foreignField: '_id',
            as: 'dislikes'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'likes._id',
            foreignField: '_id',
            as: 'likes'
          }
        },
        {
          $addFields: {
            author: {
              $let: {
                vars: {
                  authorArray: {
                    $map: {
                      input: { $objectToArray: '$author' },
                      as: 'property',
                      in: {
                        $cond: {
                          if: { $in: ['$$property.k', ['_id', 'firstName', 'lastName']] },
                          then: ['$$property.k', '$$property.v'],
                          else: null
                        }
                      }
                    }
                  }
                },
                in: {
                  $arrayToObject: {
                    $filter: {
                      input: '$$authorArray',
                      as: 'property',
                      cond: { $ne: ['$$property', null] }
                    }
                  }
                }
              }
            },
            category: {
              $let: {
                vars: {
                  categoryArray: {
                    $map: {
                      input: { $objectToArray: '$category' },
                      as: 'property',
                      in: {
                        $cond: {
                          if: { $in: ['$$property.k', ['_id', 'title']] },
                          then: ['$$property.k', '$$property.v'],
                          else: null
                        }
                      }
                    }
                  }
                },
                in: {
                  $arrayToObject: {
                    $filter: {
                      input: '$$categoryArray',
                      as: 'property',
                      cond: { $ne: ['$$property', null] }
                    }
                  }
                }
              }
            },
            likes: {
              $let: {
                vars: {
                  likesArray: {
                    $map: {
                      input: '$likes',
                      as: 'like',
                      in: {
                        _id: '$$like._id',
                        firstName: '$$like.firstName',
                        lastName: '$$like.lastName'
                      }
                    }
                  }
                },
                in: '$$likesArray'
              }
            },
            dislikes: {
              $let: {
                vars: {
                  dislikesArray: {
                    $map: {
                      input: '$dislikes',
                      as: 'dislike',
                      in: {
                        _id: '$$dislike._id',
                        firstName: '$$dislike.firstName',
                        lastName: '$$dislike.lastName'
                      }
                    }
                  }
                },
                in: '$$dislikesArray'
              }
            }
          }
        },
        {
          $set: {
            numViews: { $add: ['$numViews', 1] }
          }
        },
        { $project: projection }
      ])
      .toArray()) as PostModel[];
    if (responsePost === undefined) throw notFound('post/post-not-found');
    await collections.posts?.updateOne(match, { $inc: { numViews: 1 }, $set: { updateAt: new Date() } });
    return responsePost;
  }

  async updatePost(postId: string, { category: postCategory, ...updatePostDto }: UpdatePostDto): Promise<void> {
    let postToUpdate;
    if (typeof postCategory === 'string') {
      await this.categoryService.getOneCategory({
        _id: new ObjectId(postCategory)
      });
      postToUpdate = { ...updatePostDto, category: { _id: new ObjectId(postCategory) } };
    } else postToUpdate = { ...updatePostDto };

    await collections.posts?.updateOne(
      { _id: new ObjectId(postId) },
      { $set: { ...postToUpdate, updateAt: new Date() } }
    );
  }

  async deletePost(postId: string): Promise<void> {
    const responsePost = await collections.posts?.deleteOne({
      _id: new ObjectId(postId)
    });
    if (responsePost?.deletedCount === 0) throw notFound('post/post-not-found');
  }

  async likePost(postId: string, userId: string): Promise<string> {
    const { likes, dislikes, interactions } = await this.getPost({
      _id: new ObjectId(postId)
    });
    if (!interactions) throw notFound('Likes and dislikes are not enabled for this post');
    const isLiked = likes.some((doc) => doc._id?.equals(userId));
    const isDisliked = dislikes.some((doc) => doc._id?.equals(userId));

    // If you have disliked
    if (isDisliked) {
      await collections.posts?.updateOne(
        { _id: new ObjectId(postId) },
        {
          $pull: { dislikes: { _id: new ObjectId(userId) } },
          $push: { likes: { _id: new ObjectId(userId) } },
          $set: {
            updateAt: new Date()
          }
        }
      );
      return 'Post liked';
    }

    // If already liked
    if (isLiked) {
      await collections.posts?.updateOne(
        { _id: new ObjectId(postId) },
        {
          $pull: { likes: { _id: new ObjectId(userId) } },
          $set: {
            updateAt: new Date()
          }
        }
      );
      return 'Like removed';
    }

    // If you have not liked
    if (!isLiked) {
      await collections.posts?.updateOne(
        { _id: new ObjectId(postId) },
        {
          $push: { likes: { _id: new ObjectId(userId) } },
          $set: {
            updateAt: new Date()
          }
        }
      );
    }
    return 'Post liked';
  }

  async dislikePost(postId: string, userId: string): Promise<string> {
    const { likes, dislikes, interactions } = await this.getPost({
      _id: new ObjectId(postId)
    });
    if (!interactions) throw notFound('Likes and dislikes are not enabled for this post');
    const isLiked = likes.some((doc) => doc._id?.equals(userId));
    const isDisliked = dislikes.some((doc) => doc._id?.equals(userId));

    // If you have liked
    if (isLiked) {
      await collections.posts?.updateOne(
        { _id: new ObjectId(postId) },
        {
          $pull: { likes: { _id: new ObjectId(userId) } },
          $push: { dislikes: { _id: new ObjectId(userId) } },
          $set: {
            updateAt: new Date()
          }
        }
      );
      return 'Post disliked';
    }

    // If already disliked
    if (isDisliked) {
      await collections.posts?.updateOne(
        { _id: new ObjectId(postId) },
        {
          $pull: { dislikes: { _id: new ObjectId(userId) } },
          $set: {
            updateAt: new Date()
          }
        }
      );
      return 'Dislike removed';
    }

    // If you have not disliked
    if (!isDisliked) {
      await collections.posts?.updateOne(
        { _id: new ObjectId(postId) },
        {
          $push: { dislikes: { _id: new ObjectId(userId) } },
          $set: {
            updateAt: new Date()
          }
        }
      );
    }
    return 'Post disliked';
  }
}
