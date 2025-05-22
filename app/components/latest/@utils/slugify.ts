export const slugify = (str: string) => {
  return str.toLowerCase().replace(/ /g, "-");
};
