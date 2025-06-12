export const imgConstraints = (imgs: string[], n: number) => {
  if (!imgs || !Array.isArray(imgs)) {
    console.warn("Images array is invalid");
    return [];
  }

  if (imgs.length > n) {
    console.error(
      `No more than ${n} images are allowed. Found ${imgs.length} images.`,
    );
    return imgs.slice(0, n);
  }

  return imgs;
};
