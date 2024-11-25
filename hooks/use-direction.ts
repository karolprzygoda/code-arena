import { useEffect, useState } from "react";

const useDirection = () => {
  const [direction, setDirection] = useState<"horizontal" | "vertical">(
    "horizontal",
  );

  useEffect(() => {
    const handleResize = () => {
      setDirection(window.innerWidth < 1024 ? "vertical" : "horizontal");
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return direction;
};

export default useDirection;
