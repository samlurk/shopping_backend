import { readdir } from 'fs/promises';
import type { ReadDirIdentity } from '../types/identity.type';

/**
 * Remove .file extensions
 *
 * @param   {string[]}  fileName
 *
 * @return  {string[]}
 */

const cleanFileName = (fileName: string[]): string[] => {
  return fileName.map((file) => file.split('.').shift()).filter((file) => file !== 'index') as string[];
};

/**
 * Reads the directory asynchronously and return a response
 *
 * @param   {string}   path
 *
 * @return  {Promise<string>[]}
 */

const readDir: ReadDirIdentity<string> = async (path) => {
  const result = cleanFileName(await readdir(path));
  return result;
};

export { readDir };
