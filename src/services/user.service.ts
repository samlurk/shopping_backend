import type { CreateUserDto } from '../interfaces/user.interface';
import { encrypt, verified } from '../helpers/bcrypt.helper';
import UserModel from '../models/user.model';
import { ObjectId } from 'mongodb';
import { forbidden, notFound } from '../helpers/api-response.helper';
import EmailService from '../services/email.service';
import { generateToken, verifyToken } from '../helpers/jwt.helper';
import { handleReqQuery } from '../helpers/query.helper';
import type { UpdateUserDto } from '../types/user.type';
import MongoDbService from './mongo.service';

export class UserService {
  async createOneUser(createUserDto: CreateUserDto): Promise<void> {
    // Verify if the email and phone entered exist in another registry.
    const mongoDbService = new MongoDbService();
    const isExists = await mongoDbService.Collections.users.findOne(
      {
        $or: [{ email: createUserDto.email }, { phone: createUserDto.phone }]
      },
      { projection: { email: 1, phone: 1 } }
    );
    if (isExists !== null) {
      const { email, phone } = isExists;
      if (createUserDto.email === email) throw forbidden('user/user-email-already-exists', createUserDto);
      if (createUserDto.phone === phone) throw forbidden('user/user-phone-already-exists', createUserDto);
    }

    createUserDto.password = await encrypt(createUserDto.password);
    const userModel = new UserModel(createUserDto);
    await mongoDbService.Collections.users.insertOne(userModel);
    await mongoDbService.closeDB();
  }

  async getAllUsers(reqQuery: object): Promise<UserModel[]> {
    const mongoDbService = new MongoDbService();
    const { skip, limit, match, projection, sort } = handleReqQuery(reqQuery);
    const responseUser = await mongoDbService.Collections.users
      .aggregate<UserModel>([
        { $sort: sort },
        { $skip: skip },
        { $limit: limit },
        { $match: match },
        { $project: projection }
      ])
      .toArray();
    if (responseUser.length === 0) throw notFound('user/all-users/no-users-found');
    await mongoDbService.closeDB();
    return responseUser;
  }

  async getOneUser(reqQuery: object): Promise<UserModel> {
    const mongoDbService = new MongoDbService();
    const { projection, match } = handleReqQuery(reqQuery);
    const responseUser = await mongoDbService.Collections.users.findOne(match, { projection });

    if (responseUser === null) throw notFound('user/user-not-found');
    await mongoDbService.closeDB();
    return responseUser;
  }

  async deleteOneUser(userId: string): Promise<void> {
    const mongoDbService = new MongoDbService();
    const responseUser = await mongoDbService.Collections.users.deleteOne({ _id: new ObjectId(userId) });
    if (responseUser.deletedCount === 0) throw notFound('user/user-not-found');
    await mongoDbService.removeAllReferences(mongoDbService.Collections.users.collectionName, new ObjectId(userId));
    await mongoDbService.closeDB();
  }

  async updateOneUser(
    userId: string,
    { email: userEmail, phone: userPhone, password: userPassword, ...updateUserDto }: UpdateUserDto
  ): Promise<void> {
    const mongoDbService = new MongoDbService();
    let userToUpdate = {};
    userToUpdate = { ...updateUserDto };

    if (userEmail !== undefined) {
      const isEmailAlreadyExists = await mongoDbService.Collections.users.findOne(
        { email: userEmail },
        { projection: { email: 1 } }
      );
      if (isEmailAlreadyExists === null) userToUpdate = { ...userToUpdate, email: userEmail };
      else throw forbidden('user/edit-user/user-email-already-exists');
    }

    if (userPhone !== undefined) {
      const isPhoneAlreadyExists = await mongoDbService.Collections.users.findOne(
        { phone: userPhone },
        { projection: { phone: 1 } }
      );
      if (userPassword !== undefined) userToUpdate = { ...userToUpdate, password: await encrypt(userPassword) };

      if (isPhoneAlreadyExists === null) userToUpdate = { ...userToUpdate, phone: userPhone };
      else throw forbidden('user/edit-user/user-phone-already-exists');
    }

    const responseUser = await mongoDbService.Collections.users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { ...userToUpdate, updateAt: new Date() } }
    );
    if (responseUser.matchedCount === 0) throw notFound('user/edit-user/user-not-found');
    await mongoDbService.closeDB();
  }

  async blockOneUser(userId: string): Promise<void> {
    const mongoDbService = new MongoDbService();
    const responseUser = await mongoDbService.Collections.users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { 'metadata.isBlocked': true, updateAt: new Date() } }
    );
    if (responseUser.matchedCount === 0) throw notFound('user/block-user/user-not-found');
    await mongoDbService.closeDB();
  }

  async unblockOneUser(userId: string): Promise<void> {
    const mongoDbService = new MongoDbService();
    const responseUser = await mongoDbService.Collections.users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { 'metadata.isBlocked': false, updateAt: new Date() } }
    );
    if (responseUser.matchedCount === 0) throw notFound('user/unblock-user/user-not-found');
  }

  async updateOneUserPassword(userId: string, password: string, oldPassword: string): Promise<void> {
    const mongoDbService = new MongoDbService();
    const currentUser = await this.getOneUser({
      _id: new ObjectId(userId),
      fields: 'password'
    });
    if (!(await verified(oldPassword, currentUser.password))) throw notFound('user/edit-user/wrong-password');
    await mongoDbService.Collections.users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { password: await encrypt(password), updateAt: new Date() } }
    );
    await mongoDbService.closeDB();
  }

  async forgotOneUserPassword(email: string): Promise<void> {
    const user = await this.getOneUser({ email, fields: '_id' });
    const token = await generateToken(user, '10m');
    const emailService = new EmailService();
    await emailService.sendMail(
      email,
      'Forgot Password Link',
      'Hey User',
      `Hi, Please follow this link to reset your password. This Link is valid until 10 minutes from now, <a href='http://localhost:3002/user/reset-password/${token}'>Click Here<a/>`
    );
  }

  async resetOneUserPassword(token: string, password: string): Promise<void> {
    const mongoDbService = new MongoDbService();
    const payload = (await verifyToken(token)) as { _id: string };
    await mongoDbService.Collections.users.updateOne(
      { _id: new ObjectId(payload._id) },
      { $set: { password: await encrypt(password), updateAt: new Date() } }
    );
    await mongoDbService.closeDB();
  }
}
