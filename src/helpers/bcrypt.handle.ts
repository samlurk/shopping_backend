import { hash, compare } from 'bcryptjs';

export const encrypt = async (pwd: string) => await hash(pwd, 10);

export const verified = async (pwd: string, pwdHash: string) => await compare(pwd, pwdHash);
