import { collections } from '../config/mongo.config';
import type { User } from '../interfaces/user.interface';
import { encrypt } from '../helpers/bcrypt.handle';
import UserModel from '../models/user.model';
import { type InsertOneResult, ObjectId, type DeleteResult, type UpdateResult } from 'mongodb';
import { forbidden, notFound, serverError } from '../helpers/APIResponse.handle';

export class UserService {
  // Adding new entry
  async addUser({ firstName, lastName, email, password, role, phone }: User): Promise<InsertOneResult> {
    // Verify if the email and phone entered exist in another registry.
    const searchRequiredKeys = await this.checkUserUniqueKeys({ email, phone });
    if (searchRequiredKeys != null) {
      if (searchRequiredKeys.email === email) throw forbidden('The registered email already exists');
      throw forbidden('The registered phone already exists');
    }
    password = await encrypt(password);
    const userModel = new UserModel(firstName, lastName, email, password, role, phone);
    return (await collections.users?.insertOne(userModel)) as InsertOneResult;
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
    if (responseUser == null) throw notFound('No user registered');
    return responseUser;
  }

  async getUser(id: string): Promise<User> {
    const responseUser = (await collections.users?.findOne({ _id: new ObjectId(id) })) as User | undefined;
    if (responseUser == null) throw notFound('User not found');
    return responseUser;
  }

  async deleteUser(id: string): Promise<DeleteResult> {
    const responseUser = await collections.users?.deleteOne({ _id: new ObjectId(id) });
    if (responseUser?.deletedCount === 0) throw notFound('User not found');
    if (responseUser?.deletedCount == null) throw serverError('Unexpected Error');
    return responseUser;
  }

  async updateUser(id: string, user: User): Promise<UpdateResult> {
    if (user.password != null) user.password = await encrypt(user.password);
    user.updateAt = new Date();
    const responseUser = await collections.users?.updateOne({ _id: new ObjectId(id) }, { $set: user });
    if (responseUser?.matchedCount === 0) throw notFound('User not found');
    if (responseUser?.matchedCount == null) throw serverError('Unexpected Error');
    return responseUser;
  }

  async blockOrUnlockUser(id: string, value: boolean): Promise<void> {
    const responseUser = await collections.users?.updateOne(
      { _id: new ObjectId(id) },
      { $set: { metadata: { isBlocked: value } } }
    );
    if (responseUser?.matchedCount === 0) throw notFound('User not found');
    if (responseUser?.matchedCount == null) throw serverError('Unexpected Error');
  }
}
