"use client";
import { RefObject, useEffect, useState } from "react";

export const findLargestWidth = (elements: { offsetWidth: number }[]) => {
  let largestWidth = 0;
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    if (element.offsetWidth > largestWidth) {
      largestWidth = element.offsetWidth;
    }
  }
  return largestWidth;
};

export const useFindWidestElement = (
  containerRef: RefObject<HTMLDivElement | null>,
  dataAttribute: string,
) => {
  const [widestElement, setWidestElement] = useState<number>();
  useEffect(() => {
    if (containerRef.current) {
      const elements = Array.from(
        containerRef.current.querySelectorAll(`[${dataAttribute}]`),
      ) as HTMLElement[];
      if (elements.length === 0) {
        setWidestElement(undefined);
        return;
      }
      const maxWidth = findLargestWidth(elements);
      if (maxWidth === 0) {
        setWidestElement(undefined);
        return;
      }
      setWidestElement(maxWidth + 1);
    }
  }, []);

  return widestElement;
};
