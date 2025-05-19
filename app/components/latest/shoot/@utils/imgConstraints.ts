export const imgConstraints = (imgs: string[], n: number) => {
  if (imgs.length > n) {
    console.error(`No more than ${n} images are allowed.`);
  }
};
