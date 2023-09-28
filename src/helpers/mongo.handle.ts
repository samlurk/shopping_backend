/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { ObjectId } from 'mongodb';

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
      } else if (typeof objectToCheck[key] === 'object') {
        acc[key] = checkObjectIdOnAnObject(objectToCheck[key]);
      }
      // check if is an ObjectId
      else if (typeof objectToCheck[key] === 'string' && ObjectId.isValid(objectToCheck[key] as string)) {
        acc[key] = new ObjectId(objectToCheck[key] as string);
      }
      return acc;
    }, {});
  }

  if (typeof value === 'string' && ObjectId.isValid(value)) return new ObjectId(value);

  return value;
};
