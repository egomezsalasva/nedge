export type ShootType = {
  link?: string;
  imgs: string[];
  details: {
    city: string;
    date: string;
    title: string;
    stylist: string;
    stylistDescription?: string;
    tags: string[];
    description: string;
  };
  team?: {
    name: string;
    role: string;
  }[];
  items?: {
    id: number;
    type: string;
    name: string;
    brand: string;
    instagramLink?: string;
    affiliateLink?: string;
  }[];
};

export const shoots: ShootType[] = [
  {
    link: "/gary-gray/militant-religion",
    imgs: [
      "/imgs/militant-religion-gary-gray/militant-religion-gary-gray-1.jpeg",
      "/imgs/militant-religion-gary-gray/militant-religion-gary-gray-2.jpeg",
      "/imgs/militant-religion-gary-gray/militant-religion-gary-gray-3.jpeg",
      "/imgs/militant-religion-gary-gray/militant-religion-gary-gray-4.jpeg",
    ],
    details: {
      city: "Barcelona",
      date: "19/05/25",
      title: "MILITANT RELIGION",
      stylist: "GARY GRAY",
      stylistDescription:
        "Gary Gray is a boundary-pushing stylist known for merging contrasting cultural aesthetics into cohesive visual narratives. His work often explores themes of identity, resistance, and subcultural fusion.",
      tags: ["Military", "Urban"],
      description:
        "Blending utilitarian grit with streetwise energy, this shoot captures a defiant silhouette roaming the cityscape like a prophet of style. Oversized camo cargo pants and rugged boots meet mesh layers and bold graphics, fusing military discipline with urban rebellion. The look is both confrontational and spiritual, grounded in the streets but reaching for something higher.",
    },
    team: [
      {
        role: "Stylist",
        name: "GARY GRAY",
      },
      {
        role: "Model",
        name: "Zion Vega",
      },
      {
        role: "MUA",
        name: "Juno Kai",
      },
      {
        role: "Photographer",
        name: "Cass Idris",
      },
      {
        role: "Post-Prod Editor",
        name: "Ty Renshaw",
      },
    ],
    items: [
      {
        id: 1,
        type: "Hat",
        name: "Snug Logo Beanie",
        brand: "Ovahtres",
        affiliateLink: "https://ovahtres.de/products/snug-logo-beanie",
      },
      {
        id: 2,
        type: "T-shirt",
        name: "Summa Ain't Ova - White/Red",
        brand: "YG Studios",
        instagramLink: "https://www.instagram.com/y.g.studios/",
        affiliateLink: "https://www.yg4eva.com/password",
      },
      {
        id: 3,
        type: "Bag",
        name: "Zaino Nathan - Camouflage",
        brand: "Campomaggi",
        affiliateLink:
          "https://www.campomaggi.com/cm_it/nathan-c037550nd-x2537-f1796.html",
      },
      {
        id: 4,
        type: "Pants",
        name: "New Hunter Cargo Pants",
        brand: "Mason's",
        affiliateLink:
          "https://es.masons.it/en/collections/woman-winter-cargo-pants/products/pants-cargo-women-green-new-winter",
      },
      {
        id: 5,
        type: "Boots",
        name: "Classic 6-Inch Waterproof Boot",
        brand: "Timberland",
        affiliateLink:
          "https://www.timberland.com/en-us/p/footwear-0100/mens-timberland-classic-6-inch-waterproof-boot-TB118094231",
      },
    ],
  },
  {
    imgs: ["/imgs/city-cowgirl-stella-lawson/city-cowgirl-stella-lawson-1.png"],
    details: {
      city: "BARCELONA",
      date: "18/05/25",
      title: "CITY COWGIRLS",
      stylist: "STELLA LAWSON",
      tags: ["Urban", "Western", "Cowgirl"],
      description:
        "Inspired by the 1940s and 1950s, this shoot captures the essence of a bygone era mixed with city life.",
    },
  },
  {
    imgs: ["/imgs/cathedral-blood-liu-wong/cathedral-blood-liu-wong.jpeg"],
    details: {
      city: "AVIGNON",
      date: "17/05/25",
      title: "Crimson Vestige",
      description:
        "Framed by the solemn grandeur of old stone and a striking red cathedral door, this look threads vulnerability through rebellion. Liu Wong styles a gradient mohair knit in visceral crimson tones paired with oversized washed denim, industrial jewelry, and workwear boots—crafting a silhouette that feels both devotional and defiant. The setting turns the outfit into a statement: reverent, raw, and unapologetically modern. It’s fashion as ritual, poised between worship and resistance.",
      stylist: "LIU WONG",
      stylistDescription:
        "Liu Wong is a stylist known for fusing dramatic silhouettes with emotionally charged palettes and historical architectural references. His work often explores the tension between intimacy and spectacle.",
      tags: ["Urban", "Gothic", "Baggy"],
    },
    items: [
      {
        id: 6,
        type: "Sweater",
        name: "Battery Crew Neck",
        brand: "Levi's",
        affiliateLink:
          "https://www.urbanoutfitters.com/shop/hybrid/levis-battery-crew-neck-sweater2?quantity=1",
      },
      {
        id: 7,
        type: "Pants",
        name: "Cover Wide Denim - 3color",
        brand: "HIFIFNK",
        affiliateLink: "https://arc.net/l/quote/bjfgxbta",
      },
      {
        id: 5,
        type: "Boots",
        name: "Classic 6-Inch Waterproof Boot",
        brand: "Timberland",
        affiliateLink:
          "https://www.timberland.com/en-us/p/footwear-0100/mens-timberland-classic-6-inch-waterproof-boot-TB118094231",
      },
    ],
    team: [
      {
        role: "Stylist",
        name: "LIU WONG",
      },
      {
        role: "Model",
        name: "Ravi Solace",
      },
      {
        role: "MUA",
        name: "Jade Carrow",
      },
      {
        role: "Photographer",
        name: "Kaiya Bell",
      },
      {
        role: "Location Scout",
        name: "Anouk Veldt",
      },
    ],
  },
  {
    imgs: ["/imgs/green-ghost-dean-glok/green-ghost-dean-glok.jpeg"],
    details: {
      city: "DUBAI",
      date: "15/05/25",
      title: "GREEN GHOST",
      stylist: "DEAN GLOK",
      tags: ["Urban", "Military", "Gothic"],
      description: "",
    },
  },
  {
    imgs: ["/imgs/urban-dandy-vero-noir/urban-dandy-vero-noir.jpeg"],
    details: {
      city: "KYOTO",
      date: "12/05/25",
      title: "URBAN DANDY",
      stylist: "VERO NOIR",
      tags: ["Urban", "Casual", "Y2K", "Fusion"],
      description: "",
    },
  },
  {
    imgs: ["/imgs/denim-drift-luca-riven/denim-drift-luca-riven.jpeg"],
    details: {
      city: "TORONTO",
      date: "06/05/25",
      title: "DENIM DRIFT",
      stylist: "LUCA RIVEN",
      tags: ["Urban", "Grunge", "Racer"],
      description: "",
    },
  },
  {
    imgs: ["/imgs/chinatown-rythm-kemi-blaze/chinatown-rythm-kemi-blaze.jpeg"],
    details: {
      city: "NEW YORK",
      date: "04/05/25",
      title: "CHINATOWN RYTHM",
      stylist: "KEMI BLAZE",
      tags: ["Y2K", "Sporty", "Urban", "Baggy"],
      description: "",
    },
  },
  {
    imgs: [
      "/imgs/urban-elegance-aisha-moreau/urban-elegance-aisha-moreau.jpeg",
    ],
    details: {
      city: "Chicago",
      date: "26/04/25",
      title: "URBAN ELEGANCE",
      stylist: "AISHA MOREAU",
      tags: ["Urban", "Western", "Modern"],
      description: "",
    },
  },
  {
    imgs: [
      "/imgs/echos-of-akihabara-kiko-tanaka/echos-of-akihabara-kiko-tanaka.jpeg",
    ],
    details: {
      city: "OSAKA",
      date: "21/04/25",
      title: "ECHOES OF AKIHABARA",
      stylist: "KIKO TANAKA",
      tags: ["Sporty", "Camo", "Urban", "Baggy"],
      description: "",
    },
  },
];
