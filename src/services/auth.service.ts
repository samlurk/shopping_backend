import type { CreateUserDto } from '../interfaces/user.interface';
import { badCredentials } from '../helpers/api-response.helper';
import { verified } from '../helpers/bcrypt.helper';
import { generateToken } from '../helpers/jwt.helper';
import { UserService } from './user.service';
import type { UserSession } from '../types/user.type';

export class AuthService {
  userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async loginUser({ email: authEmail, password: authPassword }: CreateUserDto): Promise<string> {
    const user = await this.userService.getOneUser({ email: authEmail });
    if (!(await verified(authPassword, user.password))) throw badCredentials('auth/login/wrong-password');
    await this.userService.updateOneUser(user._id?.toString() as string, {
      metadata: { lastLogin: new Date() }
    });
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
