import { collections } from '../config/mongo.config';
import type { User } from '../interfaces/user.interface';
import { encrypt } from '../utils/bcrypt.handle';
import UserModel from '../models/user.model';

export class UserService {
  // Adding new entry
  async add(user: User) {
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
    const users = (await collections.users?.find({}).toArray()) as User[];
    return users;
  }

  // async getUserByEmail() {
  //   const response = (await userModel.findOne({ email: this._email })) as User;
  //   return response;
  // }
}
