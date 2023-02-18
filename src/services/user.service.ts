import { InsertOneResult, WithId } from 'mongodb';
import { collections } from '../config/mongo.config';
import type { User } from '../interfaces/user.interface';
import { encrypt } from '../utils/bcrypt.handle';
import UserModel from '../models/user.model';

export class UserService {
  async add(user: User): Promise<InsertOneResult<Document>> {
    if (await this.getUserByPhoneAndEmail({ phone: user.phone, email: user.email })) throw 'User already exists';
    user.password = await encrypt(user.password);
    user.createAt = new Date().toJSON().slice(0, 10);
    return (await collections.users?.insertOne(user as UserModel<User>)) as InsertOneResult<Document>;
  }
  async getUserByPhoneAndEmail({
    phone,
    email
  }: Pick<User, 'phone' | 'email'>): Promise<WithId<Document> | null | undefined> {
    return (await collections.users?.findOne({
      $or: [{ phone }, { email }]
    })) as WithId<Document> | null | undefined;
  }

  // async getUserByEmail() {
  //   const response = (await userModel.findOne({ email: this._email })) as User;
  //   return response;
  // }
}
