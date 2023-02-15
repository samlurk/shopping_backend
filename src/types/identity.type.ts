export type ReadDirIdentity<T> = (path: T) => Promise<T[]>;
