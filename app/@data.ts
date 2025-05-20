export type ShhotType = {
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
    description: string;
  }[];
  items?: {
    type: string;
    name: string;
    brand: string;
    affiliateLink: string;
    linkToItem: string;
  }[];
};

export const shoots: ShhotType[] = [
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
      stylistDescription: "",
      tags: ["Military", "Urban"],
      description:
        "Showcasing military-inspired outfits in the city, this shoot reflects the how the pressing issues of the world are affecting city life.",
    },
    team: [
      {
        name: "GARY GRAY",
        description: "Stylist",
      },
      {
        name: "SUSAN LEE",
        description: "MUA",
      },
      {
        name: "NATHAN HALL",
        description: "Photographer",
      },
    ],
    items: [
      {
        type: "Hat",
        name: "Grog Beanie",
        brand: "Hellstar",
        affiliateLink: "https://hellstar.com/products/grog-beanie",
        linkToItem: "/gary-gray/militant-religion#hat",
      },
      {
        type: "Shirt",
        name: "Black T-Shirt",
        brand: "Hellstar",
        affiliateLink: "https://hellstar.com/products/black-t-shirt",
        linkToItem: "/gary-gray/militant-religion#shirt",
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
      city: "TOKYO",
      date: "17/05/25",
      title: "CATHEDRAL BLOOD",
      stylist: "LIU WONG",
      tags: ["Urban", "Gothic", "Baggy"],
      description: "",
    },
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
