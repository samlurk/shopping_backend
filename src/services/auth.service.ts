import { collections } from '../config/mongo.config';
import { User } from '../interfaces/user.interface';
import { verified } from '../utils/bcrypt.handle';
import { generateToken } from '../utils/jwt.handle';

export class AuthService {
  async loginUser({ email, password }: User) {
    const user = (await collections.users?.findOne({ email }, { projection: { email: 1, password: 1 } })) as Pick<
      User,
      '_id' | 'email' | 'password'
    >;
    if (!user) throw 'Incorrect email';
    const checkPassword = await verified(password, user.password);
    if (!checkPassword) throw 'Incorrect password';
    return {
      token: await generateToken(user.email),
      data: {
        user: {
          id: user._id,
          email: user.email
        }
      }
    };
  }
}
