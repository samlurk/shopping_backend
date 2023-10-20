/* eslint-disable no-loops/no-loops */
import { type Db, MongoClient, type Collection, type BSON, type ObjectId } from 'mongodb';
import type { MongoRemove } from '../interfaces/mongodb.interface';
import { revertMongoObjectToArrayToUpdate } from '../helpers/mongo.helper';
import type UserModel from '../models/user.model';
import type ProductModel from '../models/product.model';
import type PostModel from '../models/post.model';
import type CategoryModel from '../models/category.model';

export interface Collections {
  users: Collection<UserModel>;
  products: Collection<ProductModel>;
  posts: Collection<PostModel>;
  categories: Collection<CategoryModel>;
}

export class MongoDbService {
  private readonly _client: MongoClient;
  private readonly _db: Db;
  private readonly _collections: Collections;

  constructor() {
    this._client = new MongoClient(process.env.DB_CONN_STRING as string);
    this._db = this._client.db(process.env.DB_NAME);
    this._collections = {
      users: this.getCollection<UserModel>('users'),
      products: this.getCollection<ProductModel>('products'),
      posts: this.getCollection<PostModel>('posts'),
      categories: this.getCollection<CategoryModel>('categories')
    };
  }

  get Collections(): Collections {
    return this._collections;
  }

  async connectDB(): Promise<void> {
    try {
      await this._client.connect();
      console.log(`Successfully connected to database: ${this._db.databaseName}`);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error connecting to the database: ${error.message}`);
      }
    }
  }

  async closeDB(): Promise<void> {
    try {
      await this._client.close(true);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error closing the database: ${error.message}`);
      }
    }
  }

  getCollection<T extends BSON.Document>(name: string): Collection<T> {
    return this._db.collection<T>(name);
  }

  async removeAllReferences(collectionName: string, _id: ObjectId): Promise<void> {
    try {
      const collections = await this._db.listCollections().toArray();
      for (let i = 0; i < collections.length; i++) {
        if (collections[i].name !== collectionName) {
          const response = await this._db
            .collection(collections[i].name)
            .aggregate<MongoRemove>([
              {
                $addFields: {
                  fieldsArray: {
                    $objectToArray: '$$ROOT'
                  }
                }
              },
              {
                $addFields: {
                  matchingArray: {
                    $filter: {
                      input: '$fieldsArray',
                      as: 'field',
                      cond: {
                        $isArray: '$$field.v' // Check if the value is an array
                      }
                    }
                  }
                }
              },
              {
                $addFields: {
                  matchingObject: {
                    $filter: {
                      input: {
                        $objectToArray: '$$ROOT'
                      },
                      as: 'field',
                      cond: {
                        $eq: ['$$field.v._id', _id]
                      }
                    }
                  }
                }
              },
              {
                $project: {
                  matchingArray: {
                    $filter: {
                      input: '$matchingArray',
                      as: 'field',
                      cond: {
                        $anyElementTrue: {
                          $map: {
                            input: '$$field.v',
                            as: 'subfield',
                            in: {
                              $eq: ['$$subfield._id', _id]
                            }
                          }
                        }
                      }
                    }
                  },
                  matchingObject: {
                    $arrayToObject: {
                      $map: {
                        input: '$matchingObject',
                        as: 'field',
                        in: {
                          k: '$$field.k',
                          v: '$$field.v'
                        }
                      }
                    }
                  }
                }
              }
            ])
            .toArray();

          // documents matching the object are removed (relation 1-1)
          if (response.length !== 0) {
            let countMatches = 0;
            const objectToMatch = response.reduce((acc: object, { matchingObject }) => {
              if (Object.keys(matchingObject).length !== 0) {
                countMatches++;
                if (matchingObject !== acc) acc = { ...acc, ...matchingObject };
              }
              return acc;
            }, {});
            if (countMatches === 1) {
              await this.getCollection(collections[i].name).deleteOne({ ...objectToMatch });
            }
            if (countMatches > 1) {
              await this.getCollection(collections[i].name).deleteMany({ ...objectToMatch });
            }
            // documents matching the object are removed (relation n-n)
            const { $or, $pull } = revertMongoObjectToArrayToUpdate(response, _id);
            if ($or.length !== 0 && Object.keys($pull).length !== 0) {
              await this.getCollection(collections[i].name).updateMany(
                { $or },
                {
                  $pull,
                  $set: { updateAt: new Date() }
                }
              );
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error removing documents from collection ${collectionName}: ${error.message}`);
      }
    }
  }
}

export default MongoDbService;
