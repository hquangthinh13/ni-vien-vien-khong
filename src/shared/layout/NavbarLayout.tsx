"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
export default function NavbarLayout() {
  const pathname = usePathname();

  const isHome = pathname === "/";

  return <>{!isHome ? <Navbar /> : null}</>;
}
