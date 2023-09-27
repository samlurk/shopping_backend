import { collections } from '../config/mongo.config';
import type { CreateUserDto } from '../interfaces/user.interface';
import { encrypt, verified } from '../helpers/bcrypt.handle';
import UserModel from '../models/user.model';
import { ObjectId, type WithId } from 'mongodb';
import { forbidden, notFound } from '../helpers/APIResponse.handle';
import EmailService from '../services/email.service';
import { generateToken, verifyToken } from '../helpers/jwt.handle';
import { handleReqQuery } from '../helpers/query.handle';
import type { ReqQueryDto } from '../interfaces/query.interface';
import type { UpdateUserDto } from '../types/user.type';

export class UserService {
  // Adding new entry
  async addUser(createUserDto: CreateUserDto): Promise<void> {
    // Verify if the email and phone entered exist in another registry.
    const searchRequiredKeys = await this.getUserUniqueKeys(createUserDto);
    if (searchRequiredKeys !== null && searchRequiredKeys !== undefined) {
      if (searchRequiredKeys.email === createUserDto.email) throw forbidden('user/user-email-already exists');
      throw forbidden('user/user-phone-already-exists');
    }
    createUserDto.password = await encrypt(createUserDto.password);
    const userModel = new UserModel(createUserDto);
    await collections.users?.insertOne(userModel);
  }

  private async getUserUniqueKeys({
    email,
    phone
  }: Pick<CreateUserDto, 'phone' | 'email'>): Promise<Pick<WithId<UserModel>, 'email' | 'phone'> | null | undefined> {
    return await collections.users?.findOne(
      {
        $or: [{ email }, { phone }]
      },
      { projection: { email: 1, phone: 1 } }
    );
  }

  async getAllUsers(reqQuery: ReqQueryDto): Promise<WithId<UserModel[]>> {
    const { skip, limit, match, projection, sort } = handleReqQuery(reqQuery);
    const responseUser = await collections.users
      ?.aggregate<UserModel>([
        { $sort: sort },
        { $skip: skip },
        { $limit: limit },
        { $match: match },
        { $project: projection }
      ])
      .toArray();
    if (responseUser === undefined || responseUser.length === 0) throw notFound('user/all-users/no-users-found');
    return responseUser as WithId<UserModel[]>;
  }

  async getOneUser(reqQuery: ReqQueryDto): Promise<WithId<UserModel>> {
    const { projection, match } = handleReqQuery(reqQuery);
    const responseUser = await collections.users?.findOne(match, { projection });

    if (responseUser === undefined || responseUser === null) throw notFound('user/user-not-found');
    return responseUser;
  }

  async deleteOneUser(userId: string): Promise<void> {
    const responseUser = await collections.users?.deleteOne({ _id: new ObjectId(userId) });
    if (responseUser?.deletedCount === 0) throw notFound('User not found');
  }

  async updateOneUser(userId: string, user: UpdateUserDto): Promise<void> {
    if (user.password != null) user.password = await encrypt(user.password);
    const responseUser = await collections.users?.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { ...user, updateAt: new Date() } }
    );
    if (responseUser?.matchedCount === 0) throw notFound('User not found');
  }

  async blockUser(userId: string): Promise<void> {
    const responseUser = await collections.users?.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { 'metadata.isBlocked': true, updateAt: new Date() } }
    );
    if (responseUser?.matchedCount === 0) throw notFound('user/block-user/user-not-found');
  }

  async unlockUser(userId: string): Promise<void> {
    const responseUser = await collections.users?.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { 'metadata.isBlocked': false, updateAt: new Date() } }
    );
    if (responseUser?.matchedCount === 0) throw notFound('user/unblock-user/user-not-found');
  }

  async updateUserPassword(userId: string, password: string, oldPassword: string): Promise<void> {
    const currentUser = await this.getOneUser({
      _id: new ObjectId(userId),
      fields: 'password'
    } as unknown as ReqQueryDto);
    if (!(await verified(oldPassword, currentUser.password))) throw notFound('user/edit-user/wrong-password');
    await collections.users?.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { password: await encrypt(password), updateAt: new Date() } }
    );
  }

  async forgotUserPassword(email: string): Promise<void> {
    const user = await this.getOneUser({ email, fields: '_id' } as unknown as ReqQueryDto);
    const token = await generateToken(user, '10m');
    const emailService = new EmailService();
    await emailService.sendMail(
      email,
      'Forgot Password Link',
      'Hey User',
      `Hi, Please follow this link to reset your password. This Link is valid until 10 minutes from now, <a href='http://localhost:3002/user/reset-password/${token}'>Click Here<a/>`
    );
  }

  async resetUserPassword(token: string, password: string): Promise<void> {
    const payload = (await verifyToken(token)) as { _id: string };
    console.log(typeof payload._id);
    await collections.users?.updateOne(
      { _id: new ObjectId(payload._id) },
      { $set: { password: await encrypt(password), updateAt: new Date() } }
    );
  }
}
