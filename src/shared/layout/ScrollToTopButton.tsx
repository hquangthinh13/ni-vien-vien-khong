"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { animate } from "framer-motion";
const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    animate(window.scrollY, 0, {
      type: "spring",
      stiffness: 100,
      damping: 20,
      onUpdate: (latest) => window.scrollTo(0, latest),
    });
  };

  if (!visible) return null;

  return (
    <div className=" fixed bottom-6 left-1/2 -translate-x-1/2 z-100 w-full max-w-7xl pointer-events-none">
      {" "}
      <div className="mx-auto px-4 justify-end flex">
        <Button
          size="icon-lg"
          className="rounded-full h-16 w-16 shadow-md cursor-pointer pointer-events-auto opacity-70 hover:opacity-100"
          variant="outline"
          onClick={scrollToTop}
        >
          <ArrowUp />
        </Button>
      </div>
    </div>
  );
};

export default ScrollToTopButton;
