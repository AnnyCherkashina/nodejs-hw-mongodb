export const parseSortParams = (query) => {
  const sortBy = query.sortBy || 'name';
  const sortOrder = query.sortOrder === 'desc' ? 'desc' : 'asc';
  return { sortBy, sortOrder };
};
