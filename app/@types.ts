export type ShootType = {
  name: string;
  description: string;
  slug: string;
  publication_date: string;
  city: {
    name: string;
    country: string;
  };
  stylist: {
    name: string;
    slug: string;
    description: string;
    instagram_url: string;
  };
  shoot_style_tags: {
    name: string;
    slug: string;
  }[];
  shoot_images: {
    image_url: string;
  }[];
};
