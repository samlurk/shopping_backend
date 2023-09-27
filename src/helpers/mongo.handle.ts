import { ObjectId } from 'mongodb';

export const checkObjectIdOnAnObject = (objectToCheck: Record<string, unknown>): Record<string, unknown> => {
  //* check if there is objectid in the object value and convert it
  return Object.keys(objectToCheck).reduce<Record<string, unknown>>((acc, key) => {
    if (ObjectId.isValid(objectToCheck[key] as string)) {
      acc[key] = new ObjectId(objectToCheck[key] as string);
    } else {
      acc[key] = objectToCheck[key];
    }
    return acc;
  }, {});
};
