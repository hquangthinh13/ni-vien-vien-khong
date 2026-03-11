"use client";

import React from "react";

import { MonasteryAttributes } from "@/features/monasteryPage/model/monasteryPage.types";
import MonasteryCard from "./MonasteryCard";
interface MonasteryListProps {
  items: MonasteryAttributes[];
}

export default function MonasteryList({ items }: MonasteryListProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="flex flex-col gap-12 py-12">
      {items.map((item, index) => (
        <MonasteryCard key={item.id} item={item} index={index} />
      ))}
    </div>
  );
}
