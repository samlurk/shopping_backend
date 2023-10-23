import type UserModel from '../models/user.model';

export type UserSession = Pick<UserModel, '_id' | 'firstName' | 'lastName' | 'email' | 'role'>;
