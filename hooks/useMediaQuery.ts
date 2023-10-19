import { useState, useEffect } from "react";

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const documentLoaded = () => {
      if (mediaQueryList.matches) {
        setMatches(true);
      } else {
        setMatches(false);
      }
    };

    mediaQueryList.addEventListener("change", documentLoaded);
    documentLoaded();
    return () => mediaQueryList.removeEventListener("change", documentLoaded);
  }, [query]);

  return matches;
};
