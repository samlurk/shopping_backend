import type { CreateUserDto } from '../interfaces/user.interface';
import { badCredentials } from '../helpers/APIResponse.handle';
import { verified } from '../helpers/bcrypt.handle';
import { generateToken } from '../helpers/jwt.handle';
import { UserService } from './user.service';
import type { UserSession } from '../types/user.type';
import { collections } from '../config/mongo-collections.config';

export class AuthService {
  userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async loginUser({ email, password }: CreateUserDto): Promise<string> {
    const user = await this.userService.getOneUser({ email });
    if (!(await verified(password, user.password))) throw badCredentials('auth/login/wrong-password');
    await collections.users.updateOne(
      { _id: user._id },
      { $set: { updateAt: new Date(), 'metadata.lastLogin': new Date() } }
    );
    const userSession: UserSession = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    };
    return await generateToken(userSession);
  }
}
