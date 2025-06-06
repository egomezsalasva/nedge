"use client";
import { ShootType } from "@/app/@data";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { usePathname } from "next/navigation";

export type StylistFollowing = {
  name: string;
  link: string;
};

export type WardrobeItem = {
  id: number;
  name: string;
  brand: string;
  type: string;
  sourceShootLink?: string;
};

export type UserContextType = {
  bookmarks: ShootType[];
  following: StylistFollowing[];
  wardrobe: WardrobeItem[];
  addBookmark: (shoot: ShootType) => void;
  removeBookmark: (shoot: ShootType) => void;
  addFollowing: (stylist: StylistFollowing) => void;
  removeFollowing: (stylistName: string) => void;
  addWardrobeItem: (item: WardrobeItem) => void;
  removeWardrobeItem: (itemId: number) => void;
};

// Create the context with default values
const UserContext = createContext<UserContextType>({
  bookmarks: [],
  following: [],
  wardrobe: [],
  addBookmark: () => {},
  removeBookmark: () => {},
  addFollowing: () => {},
  removeFollowing: () => {},
  addWardrobeItem: () => {},
  removeWardrobeItem: () => {},
});

// Custom hook to use the context
export const useUserContext = () => useContext(UserContext);

type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  // Initialize state from localStorage if available, otherwise use empty arrays
  const [bookmarks, setBookmarks] = useState<ShootType[]>(() => {
    if (typeof window !== "undefined") {
      const savedBookmarks = localStorage.getItem("nedge-bookmarks");
      return savedBookmarks ? JSON.parse(savedBookmarks) : [];
    }
    return [];
  });

  const [following, setFollowing] = useState<StylistFollowing[]>(() => {
    if (typeof window !== "undefined") {
      const savedFollowing = localStorage.getItem("nedge-following");
      return savedFollowing ? JSON.parse(savedFollowing) : [];
    }
    return [];
  });

  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>(() => {
    if (typeof window !== "undefined") {
      const savedWardrobe = localStorage.getItem("nedge-my-wardrobe");
      return savedWardrobe ? JSON.parse(savedWardrobe) : [];
    }
    return [];
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("nedge-bookmarks", JSON.stringify(bookmarks));
      localStorage.setItem("nedge-following", JSON.stringify(following));
      localStorage.setItem("nedge-my-wardrobe", JSON.stringify(wardrobe));
    }
  }, [bookmarks, following, wardrobe]);

  // Add a shoot to bookmarks
  const makeShootIdentifier = (shoot: ShootType) => {
    return `${shoot.details.title}-${shoot.details.stylist}`;
  };

  const addBookmark = (shoot: ShootType) => {
    const shootIdentifier = makeShootIdentifier(shoot);
    // Prevent duplicates by checking if the shoot already exists
    // Using the title and stylist as a unique identifier
    const exists = bookmarks.some(
      (bookmark) =>
        `${bookmark.details.title}-${bookmark.details.stylist}` ===
        shootIdentifier,
    );

    if (!exists) {
      setBookmarks((prev) => [shoot, ...prev]);
    }
  };

  // Remove a shoot from bookmarks
  const removeBookmark = (shoot: ShootType) => {
    const shootIdentifier = makeShootIdentifier(shoot);
    setBookmarks((prev) =>
      prev.filter(
        (bookmark) =>
          `${bookmark.details.title}-${bookmark.details.stylist}` !==
          shootIdentifier,
      ),
    );
  };

  // Add a stylist to following
  const addFollowing = (stylist: StylistFollowing) => {
    const exists = following.some((item) => item.name === stylist.name);
    if (!exists) {
      // Make sure the stylist object has a link property
      const stylistWithLink = {
        name: stylist.name,
        link: stylist.link || "", // Use provided link or empty string as fallback
      };
      setFollowing((prev) => [stylistWithLink, ...prev]);
    }
  };

  // Remove a stylist from following
  const removeFollowing = (stylistName: string) => {
    setFollowing((prev) => prev.filter((item) => item.name !== stylistName));
  };

  const pathname = usePathname();
  // Add an item to wardrobe
  const addWardrobeItem = (item: WardrobeItem) => {
    const exists = wardrobe.some(
      (wardrobeItem) =>
        `${wardrobeItem.sourceShootLink}#${wardrobeItem.id}` ===
        `${wardrobeItem.sourceShootLink}#${item.id}`,
    );
    if (!exists) {
      const itemWithLink = {
        ...item,
        sourceShootLink: pathname,
      };
      setWardrobe((prev) => [itemWithLink, ...prev]);
    }
  };

  // Remove an item from wardrobe
  const removeWardrobeItem = (itemId: number) => {
    setWardrobe((prev) =>
      prev.filter(
        (item) =>
          `${item.sourceShootLink}#${item.id}` !==
          `${item.sourceShootLink}#${itemId}`,
      ),
    );
  };

  const value = {
    bookmarks,
    following,
    wardrobe,
    addBookmark,
    removeBookmark,
    addFollowing,
    removeFollowing,
    addWardrobeItem,
    removeWardrobeItem,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
