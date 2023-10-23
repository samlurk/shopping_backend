import type { Role } from '../enums/user.enum';

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  role: Role;
  address: string | null;
  avatar: string | null;
}

export interface MetaData {
  lastLogin: Date;
  isBlocked: boolean;
  timezone: string;
}
