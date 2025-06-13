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

export const useUserContext = () => useContext(UserContext);

type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("nedge-bookmarks", JSON.stringify(bookmarks));
      localStorage.setItem("nedge-following", JSON.stringify(following));
      localStorage.setItem("nedge-my-wardrobe", JSON.stringify(wardrobe));
    }
  }, [bookmarks, following, wardrobe]);

  const makeShootIdentifier = (shoot: ShootType) => {
    return `${shoot.details.title}-${shoot.details.stylist}`;
  };

  const addBookmark = (shoot: ShootType) => {
    const shootIdentifier = makeShootIdentifier(shoot);
    const exists = bookmarks.some(
      (bookmark) =>
        `${bookmark.details.title}-${bookmark.details.stylist}` ===
        shootIdentifier,
    );

    if (!exists) {
      setBookmarks((prev) => [shoot, ...prev]);
    }
  };

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

  const addFollowing = (stylist: StylistFollowing) => {
    const exists = following.some((item) => item.name === stylist.name);
    if (!exists) {
      const stylistWithLink = {
        name: stylist.name,
        link: stylist.link || "",
      };
      setFollowing((prev) => [stylistWithLink, ...prev]);
    }
  };

  const removeFollowing = (stylistName: string) => {
    setFollowing((prev) => prev.filter((item) => item.name !== stylistName));
  };

  const pathname = usePathname();
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
