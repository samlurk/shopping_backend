import type { CreateUserDto, MetaData } from '../interfaces/user.interface';

export type UpdateUserDto = Partial<CreateUserDto> & { metadata: Partial<MetaData> };
export type UpdatePasswordDto = Pick<UpdateUserDto, 'password'> & { oldPassword?: string };
