import { InsertOneResult, WithId } from 'mongodb';
import { collections } from '../config/mongo.config';
import type { User } from '../interfaces/user.interface';
import UserModel from '../models/user.model';

export class UserService implements User {
  private _firstName: string;
  private _lastName: string;
  private _email: string;
  private _password: string;
  private _phone: string;

  constructor({ firstName, lastName, email, password, phone }: User) {
    this._firstName = firstName;
    this._lastName = lastName;
    this._email = email;
    this._password = password;
    this._phone = phone;
  }

  get firstName(): string {
    return this._firstName;
  }

  set firstName(val) {
    this._firstName = val;
  }

  get lastName(): string {
    return this._lastName;
  }

  set lastName(val) {
    this._lastName = val;
  }

  get email(): string {
    return this._email;
  }

  set email(val) {
    this._email = val;
  }

  get password(): string {
    return this._password;
  }

  set password(val) {
    this._password = val;
  }

  get phone(): string {
    return this._phone;
  }

  set phone(val) {
    this._phone = val;
  }

  async add(user: UserModel<User>): Promise<InsertOneResult<Document>> {
    const response = await collections.users?.insertOne(user);
    return response as InsertOneResult<Document>;
  }
  async getUserByPhoneAndEmail({
    phone,
    email
  }: Pick<User, 'phone' | 'email'>): Promise<WithId<Document> | null | undefined> {
    const response = await collections.users?.findOne({
      $or: [{ phone }, { email }]
    });
    return response as WithId<Document> | null | undefined;
  }

  // async getUserByEmail() {
  //   const response = (await userModel.findOne({ email: this._email })) as User;
  //   return response;
  // }
}
