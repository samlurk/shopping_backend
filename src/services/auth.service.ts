import type { CreateUserDto } from '../interfaces/user.interface';
import { badCredentials } from '../helpers/api-response.helper';
import { verified } from '../helpers/bcrypt.helper';
import { generateToken } from '../helpers/jwt.helper';
import { UserService } from './user.service';
import type { UserSession } from '../types/auth.type';
import type { LoginUserDto } from '../interfaces/auth.interface';

export class AuthService {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  signupUser(createUserDto: CreateUserDto): string {
    return 'response';
  }

  async loginUser({ authEmail, authPassword }: LoginUserDto): Promise<{ accessToken: string }> {
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
    return { accessToken: await generateToken(userSession) };
  }
}
