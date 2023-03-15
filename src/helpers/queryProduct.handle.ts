// eslint-disable-next-line @typescript-eslint/ban-types
export const sortQueryProduct = (query: string | undefined): object => {
  let sort = {};
  if (typeof query === 'string') {
    query.split(',').forEach((sortingField) => {
      let operator = -1;
      if (sortingField.search(/^[a-zA-Z]+$/g) !== -1) {
        operator = 1;
      }
      if (sortingField.search(/^-+[a-zA-Z]+$/g) !== -1) {
        sortingField = sortingField.slice(1, sortingField.length);
      }
      sort = { ...sort, ...JSON.parse(`{"${sortingField}": ${operator}}`) };
    });
    return sort;
  }
  return { createAt: -1 };
};
