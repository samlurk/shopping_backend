/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { ObjectId } from 'mongodb';
import type { MongoRemove } from '../interfaces/mongodb.interface';

export const checkObjectIdOnAnObject = (value: unknown): unknown => {
  if (typeof value === 'object' && value !== null) {
    const objectToCheck = value as Record<string, unknown>;
    // return an Object
    return Object.keys(objectToCheck).reduce<Record<string, unknown>>((acc, key) => {
      // check if is an Array
      if (Array.isArray(objectToCheck[key])) {
        const arr = objectToCheck[key] as object[];
        // return an object array
        acc[key] = arr.reduce((acc2: unknown[], curr2) => {
          acc2 = [...acc2, checkObjectIdOnAnObject(curr2)];
          return acc2;
        }, []);
        return acc;
      } else if (typeof objectToCheck[key] === 'object') {
        acc[key] = checkObjectIdOnAnObject(objectToCheck[key]);
        return acc;
      }
      // check if is an ObjectId
      else if (typeof objectToCheck[key] === 'string' && ObjectId.isValid(objectToCheck[key] as string)) {
        acc[key] = new ObjectId(objectToCheck[key] as string);
        return acc;
      }
      acc[key] = objectToCheck[key];
      return acc;
    }, {});
  }

  if (typeof value === 'string' && ObjectId.isValid(value)) return new ObjectId(value);

  return value;
};

export const revertMongoObjectToArrayToUpdate = (
  arr: MongoRemove[],
  idToMatch: ObjectId
): { $or: object[]; $pull: object } => {
  return arr.reduce(
    (acc: { $or: object[]; $pull: object }, { matchingArray }) => {
      if (matchingArray.length > 0) {
        matchingArray.forEach((element) => {
          const key = element.k;
          const [value] = element.v;

          if (Object.keys(value).length !== 0 && value._id.equals(idToMatch)) {
            const query = { [key]: value };
            acc = { ...acc, $or: [...acc.$or, query], $pull: { ...acc.$pull, ...query } };
          }
        });
      }
      return acc;
    },
    { $or: [], $pull: {} }
  );
};
