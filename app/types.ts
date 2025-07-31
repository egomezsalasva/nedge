export type ShootGarmentType = {
  id: number;
  name: string;
  type: string;
  brand: {
    name: string;
    instagram_url: string;
  };
  affiliate_link: string;
};

export type ShootType = {
  id: number;
  name: string;
  description: string;
  slug: string;
  preview_slug: string;
  publication_date: string;
  city: {
    name: string | null;
    country: string;
  };
  stylist: {
    name: string;
    slug: string;
    description: string;
    instagram_url: string | null;
  };
  shoot_style_tags: {
    name: string;
    slug: string;
  }[];
  shoot_images: {
    image_url: string;
  }[];
  shoot_garments: ShootGarmentType[];
};
