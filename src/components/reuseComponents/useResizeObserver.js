import { useEffect, useState } from "react";
import ResizeObserver from "resize-observer-polyfill";

const useResizeObserver = (ref) => {
  const [dimensions, setDimensions] = useState(null);
  useEffect(() => {
    const observerTarget = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setDimensions(entry.contentRect);
      });
    });
    resizeObserver.observe(observerTarget);
    return () => {
      resizeObserver.unobserve(observerTarget);
    };
  }, [ref]);
  return dimensions;
};

export default useResizeObserver;
