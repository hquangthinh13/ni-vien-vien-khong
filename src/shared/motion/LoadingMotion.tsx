"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import logo from "@/public/logo.svg";

export default function LoadingMotion() {
  return (
    <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-background/70 backdrop-blur-md ">
      <div className="relative flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: [0.6, 1, 0.6],
            scale: [0.98, 1.02, 0.98],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-[50px] transform scale-150" />

          <div className="relative">
            <Image
              src={logo}
              alt="Ni Viện Viên Không"
              width={128}
              height={128}
              className="h-32 w-32 object-contain brightness-110 contrast-125"
              priority
            />
          </div>
        </motion.div>

        <div className="text-center space-y-4">
          <motion.div
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl text-foreground font-script">
              Ni Viện Viên Không
            </h1>

            {/* <div className="flex items-center justify-center gap-2 mt-3">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{
                    opacity: [0.2, 1, 0.2],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                  className="w-1 h-1 rounded-full bg-primary"
                />
              ))}
            </div> */}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0, duration: 0.8 }}
            className="text-2xl text-muted-foreground font-mono"
          >
            www.vienkhongni.com
          </motion.p>
        </div>

        <div className="w-64 h-1 bg-primary/10 mt-10 overflow-hidden relative">
          <motion.div
            className="absolute inset-0 bg-primary/40"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>
    </div>
  );
}
