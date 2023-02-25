import { collections } from '../config/mongo.config';
import type { User } from '../interfaces/user.interface';
import { encrypt } from '../utils/bcrypt.handle';
import UserModel from '../models/user.model';
import { InsertOneResult, ObjectId } from 'mongodb';
import APIResponse from '../utils/APIResponse.handle';

export class UserService {
  // Adding new entry
  async addUser({ firstName, lastName, email, password, role, phone }: Omit<User, 'id'>) {
    // Verify if the email and phone entered exist in another registry.
    const searchRequiredKeys = await this.getUserRequiredKeys({ email, phone });
    if (searchRequiredKeys) {
      if (email && searchRequiredKeys.email === email)
        throw APIResponse.forbidden('The registered email already exists');
      throw APIResponse.forbidden('The registered phone already exists');
    }
    password = await encrypt(password);
    const userModel = new UserModel(firstName, lastName, email, password, role, phone);
    return (await collections.users?.insertOne(userModel)) as InsertOneResult;
  }

  async getUserRequiredKeys({ email, phone }: Pick<User, 'phone' | 'email'>) {
    return (await collections.users?.findOne(
      {
        $or: [{ email }, { phone }]
      },
      { projection: { _id: 1, email: 1, phone: 1 } }
    )) as Pick<User, '_id' | 'phone' | 'email'> | null;
  }

  async getUsers(): Promise<User[]> {
    const responseUser = (await collections.users?.find({}).toArray()) as User[];
    if (!responseUser) throw APIResponse.notFound('No user registered');
    return responseUser;
  }

  async getUser(id: string) {
    const responseUser = (await collections.users?.findOne({ _id: new ObjectId(id) })) as User;
    if (!responseUser) throw APIResponse.notFound('User not found');
    return responseUser;
  }

  async deleteUser(id: string) {
    const responseUser = await collections.users?.deleteOne({ _id: new ObjectId(id) });
    if (!responseUser?.deletedCount) throw APIResponse.notFound('User not found');
    return responseUser;
  }

  async updateUser(id: string, user: User) {
    const responseUser = await collections.users?.updateOne({ _id: new ObjectId(id) }, { $set: user });
    if (!responseUser?.matchedCount) throw APIResponse.notFound('User not found');
    return responseUser;
  }

  async blockOrUnlockUser(id: string, value: boolean) {
    const responseUser = await collections.users?.updateOne(
      { _id: new ObjectId(id) },
      { $set: { metadata: { isBlocked: value } } }
    );
    if (!responseUser?.matchedCount) throw APIResponse.notFound('User not found');
  }
}
