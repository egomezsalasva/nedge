"use client";
import { RefObject, useEffect, useState } from "react";

export const useFindWidestElement = (
  containerRef: RefObject<HTMLDivElement | null>,
  dataAttribute: string,
) => {
  const [widestElement, setWidestElement] = useState<number>();
  const findLargestWidth = (elements: HTMLElement[]) => {
    let largestWidth = 0;
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (element.offsetWidth > largestWidth) {
        largestWidth = element.offsetWidth;
      }
    }
    return largestWidth;
  };

  useEffect(() => {
    if (containerRef.current) {
      const elements = Array.from(
        containerRef.current.querySelectorAll(`[${dataAttribute}]`),
      ) as HTMLElement[];
      const maxWidth = findLargestWidth(elements);
      setWidestElement(maxWidth + 1);
    }
  }, []);

  return widestElement;
};
