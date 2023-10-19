import { useEffect, useState } from "react";

function useWindowWidth(): number {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Access the 'window' object here.
      setWindowWidth(window.innerWidth);

      // You can also add an event listener to update 'windowWidth' on window resize.
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };

      window.addEventListener("resize", handleResize);

      // Clean up the event listener when the component unmounts.
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  return windowWidth;
}

export default useWindowWidth;
