import { collections } from '../config/mongo.config';
import { User } from '../interfaces/user.interface';
import APIResponse from '../utils/APIResponse.handle';
import { verified } from '../utils/bcrypt.handle';
import { generateToken } from '../utils/jwt.handle';

export class AuthService {
  async loginUser({ email, password }: User) {
    const user = (await collections.users?.findOne(
      { email },
      { projection: { email: 1, password: 1, role: 1 } }
    )) as Pick<User, '_id' | 'email' | 'password' | 'role'>;
    if (!user) throw APIResponse.badCredentials('Incorrect email');
    const checkPassword = await verified(password, user.password);
    if (!checkPassword) throw APIResponse.badCredentials('Incorrect password');
    return {
      token: await generateToken(user._id, user.email, user.role)
    };
  }
}
