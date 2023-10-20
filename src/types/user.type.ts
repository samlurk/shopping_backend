import type UserModel from '../models/user.model';
import type { CreateUserDto, MetaData } from '../interfaces/user.interface';

export type UserSession = Pick<UserModel, '_id' | 'firstName' | 'lastName' | 'email' | 'role'>;
export type UpdateUserDto = Partial<CreateUserDto> & { metadata: Partial<MetaData> };
export type UpdatePasswordDto = Pick<UpdateUserDto, 'password'> & { oldPassword?: string };
