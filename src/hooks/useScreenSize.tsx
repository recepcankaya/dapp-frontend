import { useResizeObserver } from "@wojtekmaj/react-hooks";
import { useState, useCallback } from "react";

const resizeObserverOptions = {};

export default function useScreenSize() {
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries;

    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  useResizeObserver(containerRef, resizeObserverOptions, onResize);

  return { setContainerRef, containerWidth };
}
