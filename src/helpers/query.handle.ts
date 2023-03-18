export const sortQueryProduct = (query: string | undefined): object => {
  //* Sorting
  if (typeof query === 'string') {
    let sort = {};
    let operator = -1;
    query.split(',').forEach((field) => {
      if (field.search(/^[a-zA-Z]+$/g) !== -1) {
        operator = 1;
      }
      if (field.search(/^-+[a-zA-Z]+$/g) !== -1) {
        field = field.slice(1, field.length);
      }
      sort = { ...sort, ...JSON.parse(`{"${field}": ${operator}}`) };
    });
    return sort;
  }
  return { createAt: -1 };
};

//* Limiting the fields
export const limitQueryFields = (query: string | undefined): object => {
  if (typeof query === 'string') {
    let limitFields = {};
    query.split(',').forEach((field) => {
      limitFields = { ...limitFields, ...JSON.parse(`{"${field}": 1}`) };
    });
    return limitFields;
  }
  return { showAllProperties: 0 }; // TODO: Refactor this
};
