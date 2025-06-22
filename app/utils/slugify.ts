export const slugify = (str: string) => {
  return str
    .toLowerCase()
    .replace(/['']/g, "") // Remove apostrophes and similar characters
    .replace(/[^a-z0-9\s-]/g, "") // Remove any other special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with a single hyphen
    .trim(); // Remove leading/trailing spaces or hyphens
};
