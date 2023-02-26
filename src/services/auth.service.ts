import { collections } from '../config/mongo.config';
import { User } from '../interfaces/user.interface';
import APIResponse from '../helpers/APIResponse.handle';
import { verified } from '../helpers/bcrypt.handle';
import { generateToken } from '../helpers/jwt.handle';

export class AuthService {
  async loginUser({ email, password }: User) {
    const user = (await collections.users?.findOne(
      { email },
      { projection: { _id: 1, email: 1, password: 1, role: 1, metadata: { isBlocked: 1 } } }
    )) as Pick<User, '_id' | 'email' | 'password' | 'role' | 'metadata'>;
    if (!user) throw APIResponse.badCredentials('Incorrect email');
    const checkPassword = await verified(password, user.password);
    if (!checkPassword) throw APIResponse.badCredentials('Incorrect password');
    await collections.users?.updateOne({ _id: user._id }, { $set: { metadata: { lastLogin: new Date() } } });
    return {
      token: await generateToken(user)
    };
  }
}
