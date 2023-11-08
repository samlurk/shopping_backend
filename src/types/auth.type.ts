import type { CreateUserDto } from '../interfaces/user.interface';
import type UserModel from '../models/user.model';

export type SignUpUserDto = Omit<CreateUserDto, 'role'>;

export type UserSession = Pick<UserModel, '_id' | 'firstName' | 'lastName' | 'email' | 'role'>;
