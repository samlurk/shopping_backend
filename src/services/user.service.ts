import { collections } from '../config/mongo.config';
import type { User } from '../interfaces/user.interface';
import { encrypt } from '../utils/bcrypt.handle';
import UserModel from '../models/user.model';
import { ObjectId, WithId } from 'mongodb';

export class UserService {
  // Adding new entry
  async addUser(user: User) {
    if (await this.getUserRequiredKeys({ phone: user.phone, email: user.email })) throw 'User already exists';
    user.password = await encrypt(user.password);
    user.createAt = new Date().toJSON().slice(0, 10);
    return await collections.users?.insertOne(user as UserModel<User>);
  }

  // Verify if the email and phone entered exist in another registry.
  async getUserRequiredKeys({ phone, email }: Pick<User, 'phone' | 'email'>) {
    return await collections.users?.findOne(
      {
        $or: [{ phone }, { email }]
      },
      { projection: { _id: 1 } }
    );
  }

  async getUsers(): Promise<User[]> {
    const responseUser = (await collections.users?.find({}).toArray()) as User[];
    if (!responseUser) throw 'No user registered';
    return responseUser;
  }

  async getUser(id: string) {
    const responseUser = (await collections.users?.findOne({ _id: new ObjectId(id) })) as User;
    if (!responseUser) throw "User don't exist";
    return responseUser;
  }

  async deleteUser(id: string) {
    const responseUser = await collections.users?.deleteOne({ _id: new ObjectId(id) });
    if (responseUser) throw "User don't exist";
    return responseUser;
  }

  async updateUser(id: string, user: User) {
    const responseUser = await collections.users?.updateOne({ _id: new ObjectId(id) }, { $set: user });
    if (!responseUser?.matchedCount) throw "User don't exist";
    return responseUser;
  }
}
