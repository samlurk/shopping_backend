import { collections } from '../config/mongo-collections.config';
import type { CreateUserDto } from '../interfaces/user.interface';
import { encrypt, verified } from '../helpers/bcrypt.handle';
import UserModel from '../models/user.model';
import { ObjectId } from 'mongodb';
import { forbidden, notFound } from '../helpers/APIResponse.handle';
import EmailService from '../services/email.service';
import { generateToken, verifyToken } from '../helpers/jwt.handle';
import { handleReqQuery } from '../helpers/query.handle';
import type { UpdateUserDto } from '../types/user.type';
import MongoDbService from './mongo.service';

export class UserService {
  mongoService: MongoDbService;

  constructor() {
    this.mongoService = new MongoDbService();
  }

  async createOneUser(createUserDto: CreateUserDto): Promise<void> {
    // Verify if the email and phone entered exist in another registry.
    const isExists = await collections.users.findOne(
      {
        $or: [{ email: createUserDto.email }, { phone: createUserDto.phone }]
      },
      { projection: { email: 1, phone: 1 } }
    );
    if (isExists !== null) {
      const { email, phone } = isExists;
      if (createUserDto.email === email) throw forbidden('user/user-email-already-exists');
      if (createUserDto.phone === phone) throw forbidden('user/user-phone-already-exists');
    }

    createUserDto.password = await encrypt(createUserDto.password);
    const userModel = new UserModel(createUserDto);
    await collections.users.insertOne(userModel);
  }

  async getAllUsers(reqQuery: object): Promise<UserModel[]> {
    const { skip, limit, match, projection, sort } = handleReqQuery(reqQuery);
    const responseUser = await collections.users
      .aggregate<UserModel>([
        { $sort: sort },
        { $skip: skip },
        { $limit: limit },
        { $match: match },
        { $project: projection }
      ])
      .toArray();
    if (responseUser.length === 0) throw notFound('user/all-users/no-users-found');
    return responseUser;
  }

  async getOneUser(reqQuery: object): Promise<UserModel> {
    const { projection, match } = handleReqQuery(reqQuery);
    const responseUser = await collections.users.findOne(match, { projection });

    if (responseUser === null) throw notFound('user/user-not-found');
    return responseUser;
  }

  async deleteOneUser(userId: string): Promise<void> {
    const responseUser = await collections.users.deleteOne({ _id: new ObjectId(userId) });
    if (responseUser.deletedCount === 0) throw notFound('user/user-not-found');
    await this.mongoService.remove(collections.users.collectionName, new ObjectId(userId));
  }

  async updateOneUser(
    userId: string,
    { email: userEmail, phone: userPhone, password: userPassword, ...updateUserDto }: UpdateUserDto
  ): Promise<void> {
    let userToUpdate = {};
    userToUpdate = { ...updateUserDto };
    if (userPassword !== undefined) userToUpdate = { ...userToUpdate, password: await encrypt(userPassword) };

    if (userEmail !== undefined) {
      const isEmailAlreadyExists = await collections.users.findOne({ email: userEmail }, { projection: { email: 1 } });
      if (isEmailAlreadyExists === null) userToUpdate = { ...userToUpdate, email: userEmail };
      else throw forbidden('user/edit-user/user-email-already-exists');
    }

    if (userPhone !== undefined) {
      const isPhoneAlreadyExists = await collections.users.findOne({ phone: userPhone }, { projection: { phone: 1 } });
      if (isPhoneAlreadyExists === null) userToUpdate = { ...userToUpdate, phone: userPhone };
      else throw forbidden('user/edit-user/user-phone-already-exists');
    }

    const responseUser = await collections.users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { ...userToUpdate, updateAt: new Date() } }
    );
    if (responseUser.matchedCount === 0) throw notFound('user/edit-user/user-not-found');
  }

  async blockOneUser(userId: string): Promise<void> {
    const responseUser = await collections.users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { 'metadata.isBlocked': true, updateAt: new Date() } }
    );
    if (responseUser.matchedCount === 0) throw notFound('user/block-user/user-not-found');
  }

  async unblockOneUser(userId: string): Promise<void> {
    const responseUser = await collections.users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { 'metadata.isBlocked': false, updateAt: new Date() } }
    );
    if (responseUser.matchedCount === 0) throw notFound('user/unblock-user/user-not-found');
  }

  async updateOneUserPassword(userId: string, password: string, oldPassword: string): Promise<void> {
    const currentUser = await this.getOneUser({
      _id: new ObjectId(userId),
      fields: 'password'
    });
    if (!(await verified(oldPassword, currentUser.password))) throw notFound('user/edit-user/wrong-password');
    await collections.users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { password: await encrypt(password), updateAt: new Date() } }
    );
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
    const payload = (await verifyToken(token)) as { _id: string };
    await collections.users.updateOne(
      { _id: new ObjectId(payload._id) },
      { $set: { password: await encrypt(password), updateAt: new Date() } }
    );
  }
}
