import type { WithId } from 'mongodb';
import type UserModel from '../models/user.model';
import type { CreateUserDto } from '../interfaces/user.interface';

export type UserSession = Pick<WithId<UserModel>, '_id' | 'firstName' | 'lastName' | 'email' | 'role'>;
export type UpdateUserDto = Partial<CreateUserDto>;
export type UpdatePasswordDto = Pick<UpdateUserDto, 'password'> & { oldPassword?: string };
