import { collections } from '../config/mongo.config';
import type { User } from '../interfaces/user.interface';
import { encrypt, verified } from '../helpers/bcrypt.handle';
import UserModel from '../models/user.model';
import { ObjectId } from 'mongodb';
import { forbidden, notFound } from '../helpers/APIResponse.handle';
import EmailService from '../services/email.service';
import { generateToken, verifyToken } from '../helpers/jwt.handle';
import { randomBytes } from 'crypto';

export class UserService {
  // Adding new entry
  async addUser({ firstName, lastName, email, password, role, phone }: User): Promise<void> {
    // Verify if the email and phone entered exist in another registry.
    const searchRequiredKeys = await this.checkUserUniqueKeys({ email, phone });
    if (searchRequiredKeys != null) {
      if (searchRequiredKeys.email === email) throw forbidden('The registered email already exists');
      throw forbidden('The registered phone already exists');
    }
    password = await encrypt(password);
    const userModel = new UserModel(firstName, lastName, email, password, role, phone);
    await collections.users?.insertOne(userModel);
  }

  async checkUserUniqueKeys({
    email,
    phone
  }: Pick<User, 'phone' | 'email'>): Promise<Pick<User, 'phone' | 'email'> | null> {
    return (await collections.users?.findOne(
      {
        $or: [{ email }, { phone }]
      },
      { projection: { email: 1, phone: 1 } }
    )) as Pick<User, 'phone' | 'email'> | null;
  }

  async getUsers(): Promise<User[]> {
    const responseUser = collections.users
      ?.find({})
      .map((doc) => doc)
      .toArray() as User[] | undefined;
    if (responseUser == null) throw notFound('No users registered');
    return responseUser;
  }

  async getUserById(userId: string, projection?: object): Promise<User> {
    let responseUser: User | undefined;
    if (projection === undefined)
      responseUser = (await collections.users?.findOne({ _id: new ObjectId(userId) })) as User | undefined;
    else
      responseUser = (await collections.users?.findOne({ _id: new ObjectId(userId) }, projection)) as User | undefined;
    if (responseUser == null) throw notFound('User not found');
    return responseUser;
  }

  async getUserByEmail(email: string, projection?: object): Promise<User> {
    let responseUser: User | undefined;
    if (projection === undefined) responseUser = (await collections.users?.findOne({ email })) as User | undefined;
    else responseUser = (await collections.users?.findOne({ email }, { projection })) as User | undefined;
    if (responseUser == null) throw notFound('User not found');
    return responseUser;
  }

  async deleteUser(userId: string): Promise<void> {
    const responseUser = await collections.users?.deleteOne({ _id: new ObjectId(userId) });
    if (responseUser?.deletedCount === 0) throw notFound('User not found');
  }

  async updateUser(userId: string, user: User): Promise<void> {
    if (user.password != null) user.password = await encrypt(user.password);
    user.updateAt = new Date();
    const responseUser = await collections.users?.updateOne({ _id: new ObjectId(userId) }, { $set: user });
    if (responseUser?.matchedCount === 0) throw notFound('User not found');
  }

  async blockOrUnlockUser(userId: string, value: boolean): Promise<void> {
    const responseUser = await collections.users?.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { metadata: { isBlocked: value } } }
    );
    if (responseUser?.matchedCount === 0) throw notFound('User not found');
  }

  async updateUserPassword(userId: string, password: string, oldPassword?: string): Promise<void> {
    if (oldPassword !== undefined) {
      const currentUser = await this.getUserById(userId, { password: 1, _id: 0 });
      if (!(await verified(oldPassword, currentUser.password))) throw notFound('Current password is incorrect');
    }
    await collections.users?.updateOne({ _id: new ObjectId(userId) }, { $set: { password: await encrypt(password) } });
  }

  async forgotUserPassword(email: string): Promise<void> {
    const user = await this.getUserByEmail(email, { _id: 1 });
    if (user === undefined) throw notFound('The e-mail address entered does not exist');
    const token = await generateToken(
      {
        user,
        passwordResetToken: randomBytes(32).toString('hex')
      },
      '10m'
    );
    const emailService = new EmailService();
    await emailService.sendMail(
      email,
      'Forgot Password Link',
      'Hey User',
      `Hi, Please follow this link to reset your password. This Link is valid until 10 minutes from now, <a href='http://localhost:3001/user/reset-password/${token}'>Click Here<a/>`
    );
  }

  async resetUserPassword(token: string, password: string): Promise<void> {
    const payload = (await verifyToken(token)) as { user: { _id: string }; passwordResetToken: string };
    await this.updateUserPassword(payload.user._id, password);
  }
}
