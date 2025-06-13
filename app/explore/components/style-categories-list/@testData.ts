type SubStyleType = {
  name: string;
  slug: string;
};

type StyleCategoryType = {
  name: string;
  subStyles: SubStyleType[];
};

export const testData: StyleCategoryType[] = [
  {
    name: "Test Category",
    subStyles: [
      {
        name: "Test Subcategory 1",
        slug: "test-subcategory-1",
      },
      {
        name: "Test Subcategory 2",
        slug: "test-subcategory-2",
      },
      {
        name: "Test Subcategory 3",
        slug: "test-subcategory-3",
      },
      {
        name: "Test Subcategory 4",
        slug: "test-subcategory-4",
      },
      {
        name: "Test Subcategory 5",
        slug: "test-subcategory-5",
      },
    ],
  },
  {
    name: "Test Category 2",
    subStyles: [
      {
        name: "Test Subcategory 2 1",
        slug: "test-subcategory-2-1",
      },
      {
        name: "Test Subcategory 2 2",
        slug: "test-subcategory-2-2",
      },
      {
        name: "Test Subcategory 2 3",
        slug: "test-subcategory-2-3",
      },
      {
        name: "Test Subcategory 2 4",
        slug: "test-subcategory-2-4",
      },
      {
        name: "Test Subcategory 2 5",
        slug: "test-subcategory-2-5",
      },
    ],
  },
];
