import type { BSON } from 'mongodb';

export interface MongodbOPerators {
  skip: number;
  limit: number;
  match: object;
  projection: object;
  sort: object;
}

export interface MongoRemove extends BSON.Document {
  matchingObject: object;
  matchingArray: ObjectToArray[];
}

export interface ObjectToArray {
  k: string;
  v: object[];
}
