export type ShhotType = {
  imgs: string[];
  details: {
    city: string;
    date: string;
    title: string;
    stylist: string;
    tags: string[];
    description: string;
  };
};

export const shoots: ShhotType[] = [
  {
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
      tags: ["Military", "Urban"],
      description:
        "Showcasing military-inspired outfits in the city, this shoot reflects the how the pressing issues of the world are affecting city life.",
    },
  },
  {
    imgs: ["/imgs/city-cowgirl-stella-lawson/city-cowgirl-stella-lawson-1.png"],
    details: {
      city: "Barcelona",
      date: "19/05/25",
      title: "CITY COWGIRLS",
      stylist: "STELLA LAWSON",
      tags: ["Urban", "Western", "Cowgirl"],
      description:
        "Inspired by the 1940s and 1950s, this shoot captures the essence of a bygone era mixed with city life.",
    },
  },
];
