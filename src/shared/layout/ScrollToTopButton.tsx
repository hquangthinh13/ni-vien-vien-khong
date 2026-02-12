"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/shared/ui/button";

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300); // show after user scrolls 300px
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // run once on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!visible) return null;

  return (
    <div className=" fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-100 w-full max-w-10xl pointer-events-none">
      {" "}
      <div className="mx-auto px-4 justify-end flex">
        <Button
          size="icon-lg"
          className="rounded-full shadow-md cursor-pointer pointer-events-auto opacity-50 hover:opacity-100"
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
