/* eslint-disable no-loops/no-loops */
import 'dotenv/config';
import { UserService } from '../../src/services/user.service';
import mongoServer from '../../src/helpers/tests-helper/db.test-helper';
import { fakeUserData } from '../../src/fixtures/user.fixture';
import { forbidden, notFound } from '../../src/helpers/api-response.helper';
import { ObjectId } from 'mongodb';

describe('User Service', () => {
  const userService = new UserService();
  beforeEach(async () => {
    await mongoServer.connect();
  });

  afterEach(async () => {
    await mongoServer.clear();
    await mongoServer.close();
  });

  describe('should test #createOneUser', () => {
    it('should return true when user created sucess', async () => {
      const userInsertedResult = await userService.createOneUser(fakeUserData);
      expect(userInsertedResult.acknowledged).toBeTruthy();
      expect(userInsertedResult.insertedId).toBeDefined();
    });

    it('should throw custom errors', async () => {
      const uniqueKeys = { email: fakeUserData.email, phone: fakeUserData.phone };
      await userService.createOneUser(fakeUserData);
      for (const key in uniqueKeys) {
        try {
          uniqueKeys.email = key === 'email' ? fakeUserData.email : 'testanother@gmail.com';
          uniqueKeys.phone = key === 'phone' ? fakeUserData.phone : 'testanotherphone';
          const mockUserToCreate = { ...fakeUserData, ...uniqueKeys };
          await userService.createOneUser(mockUserToCreate);
        } catch (error) {
          const data = { ...fakeUserData, ...uniqueKeys };
          if (key === 'email') expect(error).toEqual(forbidden('user/user-email-already-exists', data));
          if (key === 'phone') expect(error).toEqual(forbidden('user/user-phone-already-exists', data));
        }
      }
    });
  });

  describe('should test #getAllUsers', () => {
    it('should return array of users', async () => {
      await userService.createOneUser(fakeUserData);
      const userResponse = await userService.getAllUsers({});
      expect(userResponse).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            _id: expect.any(ObjectId),
            firstName: expect.any(String),
            lastName: expect.any(String),
            email: expect.any(String),
            password: expect.any(String),
            phone: expect.any(String),
            role: expect.any(String),
            avatar: expect.any(String),
            address: expect.any(String),
            metadata: expect.objectContaining({
              lastLogin: expect.any(Date),
              isBlocked: expect.any(Boolean),
              timezone: expect.any(String)
            }),
            createAt: expect.any(Date),
            updateAt: expect.any(Date)
          })
        ])
      );
    });

    it(' should throw custom error', async () => {
      try {
        await userService.getAllUsers({});
      } catch (error) {
        expect(error).toEqual(notFound('user/all-users/no-users-found'));
      }
    });
  });

  describe('should test #getOneUser', () => {
    it('should return an user object', async () => {
      await userService.createOneUser(fakeUserData);
      const userResponse = await userService.getOneUser({ email: fakeUserData.email });
      expect(userResponse).toEqual(
        expect.objectContaining({
          _id: expect.any(ObjectId),
          firstName: expect.any(String),
          lastName: expect.any(String),
          email: expect.any(String),
          password: expect.any(String),
          phone: expect.any(String),
          role: expect.any(String),
          avatar: expect.any(String),
          address: expect.any(String),
          metadata: expect.objectContaining({
            lastLogin: expect.any(Date),
            isBlocked: expect.any(Boolean),
            timezone: expect.any(String)
          }),
          createAt: expect.any(Date),
          updateAt: expect.any(Date)
        })
      );
    });

    it(' should throw custom error', async () => {
      try {
        await userService.getOneUser({});
      } catch (error) {
        expect(error).toEqual(notFound('user/user-not-found'));
      }
    });
  });

  // describe('should test #deleteOneUser', () => {
  //   it('should return true when user deleted sucess', async () => {
  //     const userResponseCreated = await userService.createOneUser(fakeUserData);
  //     const userId = userResponseCreated.insertedId.toString();
  //     const { deleteResult, updateResult } = await userService.deleteOneUser(userId);

  //     expect(deleteResult.acknowledged).toBeTruthy();
  //     expect(deleteResult.deletedCount).toBeGreaterThanOrEqual(1);

  //     if (updateResult.acknowledged) {
  //       expect(updateResult.matchedCount).toBeGreaterThanOrEqual(1);
  //       expect(updateResult.modifiedCount).toBeGreaterThanOrEqual(1);
  //     }
  //   });

  //   it('should throw custom errors', async () => {});
  // });

  // should test #updateOneUser

  // should test #blockOneUser

  // should test #unblockOneUser

  // should test #updateOneUserPassword

  // should test #forgotOneUserPassword

  // should test #resetOneUserPassword
});
