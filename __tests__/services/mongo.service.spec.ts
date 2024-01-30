/* eslint-disable no-loops/no-loops */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import 'dotenv/config';
import MongoDbService from '../../src/services/mongo.service';
import mongoServer from '../../src/helpers/tests-helper/db.test-helper';
import { UserService } from '../../src/services/user.service';
import { fakeUserData, fakeUserData2 } from '../../src/fixtures/user.fixture';
import CategoryService from '../../src/services/category.service';
import { PostService } from '../../src/services/post.service';
import { fakeCategoryData } from '../../src/fixtures/category.fixture';
import { fakePostData } from '../../src/fixtures/post.fixture';

describe('Mongo Service', () => {
  let mongoDbService: MongoDbService;
  let userService: UserService;
  let categoryService: CategoryService;
  let postService: PostService;

  beforeEach(async () => {
    jest.clearAllMocks();
    await mongoServer.connect();
    mongoDbService = new MongoDbService();
    userService = new UserService();
    categoryService = new CategoryService();
    postService = new PostService();
  });
  afterEach(async () => {
    await mongoServer.close();
  });

  it('should connect the client', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const clientConnectSpy = jest.spyOn(mongoDbService.Client, 'connect');

    await mongoDbService.connectDB();

    expect(clientConnectSpy).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(`Successfully connected to database: ${mongoDbService.Db.databaseName}`);
  });

  it('should close the client', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const clientCloseSpy = jest.spyOn(mongoDbService.Client, 'close');

    await mongoDbService.closeDB();
    expect(clientCloseSpy).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(`Database successfully closed: ${mongoDbService.Db.databaseName}`);
  });

  describe('should test #remove', () => {
    it('should remove references in objects', async () => {
      const { insertedId: userWhoCreatedThePost } = await userService.createOneUser(fakeUserData);
      const { insertedId: categoryId } = await categoryService.createOneCategory(fakeCategoryData);
      fakePostData.category = categoryId.toString();
      await postService.createOnePost(userWhoCreatedThePost.toString(), fakePostData);

      await mongoDbService.Collections.users.deleteOne({ _id: userWhoCreatedThePost });
      const { deleteResult } = await mongoDbService.removeAllReferences(
        mongoDbService.Collections.users.collectionName,
        userWhoCreatedThePost
      );
      expect(deleteResult.acknowledged).toBeTruthy();
      expect(deleteResult.deletedCount).toBeGreaterThanOrEqual(1);
    });

    it('should remove references in array objects', async () => {
      const { insertedId: userWhoCreatedThePost } = await userService.createOneUser(fakeUserData);
      const { insertedId: userWhoLikesThePost } = await userService.createOneUser(fakeUserData2);
      const { insertedId: categoryId } = await categoryService.createOneCategory(fakeCategoryData);
      fakePostData.category = categoryId.toString();
      const postResponse = await postService.createOnePost(userWhoCreatedThePost.toString(), fakePostData);

      await postService.likePost(postResponse.insertedId.toString(), userWhoLikesThePost.toString());

      await mongoDbService.Collections.users.deleteOne({ _id: userWhoLikesThePost });
      const { updateResult } = await mongoDbService.removeAllReferences(
        mongoDbService.Collections.users.collectionName,
        userWhoLikesThePost
      );
      expect(updateResult.acknowledged).toBeTruthy();
      expect(updateResult.modifiedCount).toBeGreaterThanOrEqual(1);
    });
  });

  it('should clear database', async () => {
    await userService.createOneUser(fakeUserData);

    const collections = await mongoDbService.Db.listCollections().toArray();
    const getCollectionSpy = jest.spyOn(mongoDbService, 'getCollection');

    const clearDatabaseResult = await mongoDbService.clearDB();
    expect(getCollectionSpy).toHaveBeenCalledTimes(collections.length);
    expect(clearDatabaseResult).toBeTruthy();
  });
});
