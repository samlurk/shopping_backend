import { ObjectId } from 'mongodb';
import { User } from '../interfaces/user.interface';

// Declare the Schema of the Mongo model
export default class UserModel<T extends User> {
  constructor({ firstName, lastName, email, password, phone, createAt }: T, id?: ObjectId) {}
}
