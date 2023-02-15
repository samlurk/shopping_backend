import { Schema, model } from 'mongoose';
import type { User } from '../interfaces/user.interface';

// Declare the Schema of the Mongo model
const userSchema = new Schema<User>(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    phone: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: true, versionKey: false }
);

const userModel = model('users', userSchema);
export default userModel;
