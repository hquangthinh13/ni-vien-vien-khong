"use client";
import React, { useEffect, useState } from "react";
import {
  motion,
  useSpring,
  useMotionValue,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";
import cursorImage from "@/public/cursor.svg";
const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [clicked, setClicked] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        ["button", "a"].includes(target.tagName.toLowerCase()) ||
        target.closest("button")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", () => setClicked(true));
    window.addEventListener("mouseup", () => setClicked(false));

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  });

  return (
    <div className="fixed inset-0 pointer-events-none z-9999">
      <motion.div
        style={{ x: cursorX, y: cursorY }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0.4 : 0.2,
          borderWidth: isHovering ? "1px" : "2px",
        }}
        className="absolute top-0 left-0 w-12 h-12 border-dashed border-primary rounded-full -translate-x-1/2 -translate-y-1/2"
      />

      <motion.div
        style={{ x: mouseX, y: mouseY }}
        animate={{
          //   rotate: 360,
          scale: clicked ? 0.8 : isHovering ? 1.2 : 1,
        }}
        transition={{
          scale: { type: "spring", stiffness: 300 },
        }}
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="w-12 h-12 relative ornament-cursor">
          <Image
            src={cursorImage}
            alt="cursor"
            fill
            className="object-contain"
          />
        </div>
      </motion.div>

      <AnimatePresence>
        {clicked && (
          <motion.div
            initial={{
              x: mouseX.get(),
              y: mouseY.get(),
              scale: 0,
              opacity: 0.5,
            }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 left-0 w-10 h-10 bg-primary/20 rounded-full -translate-x-1/2 -translate-y-1/2"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomCursor;
