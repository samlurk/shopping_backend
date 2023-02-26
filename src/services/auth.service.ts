import { collections } from '../config/mongo.config';
import type { User } from '../interfaces/user.interface';
import { badCredentials } from '../helpers/APIResponse.handle';
import { verified } from '../helpers/bcrypt.handle';
import { generateToken } from '../helpers/jwt.handle';

export class AuthService {
  async loginUser({ email, password }: User): Promise<{ token: string }> {
    const user = (await collections.users?.findOne(
      { email },
      { projection: { _id: 1, email: 1, password: 1, role: 1 } }
    )) as Pick<User, '_id' | 'email' | 'password' | 'role'> | undefined;
    if (user == null) throw badCredentials('Incorrect email');
    if (!(await verified(password, user.password))) throw badCredentials('Incorrect password');
    await collections.users?.updateOne({ _id: user._id }, { $set: { metadata: { lastLogin: new Date() } } });
    return {
      token: await generateToken(user)
    };
  }
}
