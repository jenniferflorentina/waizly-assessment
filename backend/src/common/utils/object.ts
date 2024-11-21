export const omitId = (data: any): any => {
  const { id, ...rest } = data;
  return rest;
};

export const omitIdAndVersion = (data: any): any => {
  const { id, version, ...rest } = data;
  return rest;
};
