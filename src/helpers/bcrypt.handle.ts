import { hash, compare } from 'bcryptjs';

export const encrypt = async (pwd: string): Promise<string> => await hash(pwd, 10);

export const verified = async (pwd: string, pwdHash: string): Promise<boolean> => await compare(pwd, pwdHash);
