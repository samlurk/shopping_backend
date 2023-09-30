import type { ObjectId } from 'mongodb';
import { Role } from '../enums/user.enum';
import type { CreateUserDto, MetaData } from '../interfaces/user.interface';

// Declare the Schema of the Mongo model
export default class UserModel {
  _id?: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
  phone: string;
  address: string | null;
  avatar: string | null;
  metadata: MetaData;
  createAt: Date;
  updateAt: Date;

  constructor({
    firstName,
    lastName,
    email,
    password,
    role = Role.Customer,
    phone,
    address = null,
    avatar = null
  }: CreateUserDto) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.role = role;
    this.phone = phone;
    this.address = address;
    this.avatar = avatar;
    this.metadata = {
      lastLogin: new Date(),
      isBlocked: false,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
    this.createAt = new Date();
    this.updateAt = new Date();
  }
}
