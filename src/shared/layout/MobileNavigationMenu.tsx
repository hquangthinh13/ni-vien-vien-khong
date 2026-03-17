import React from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui/accordion";
import { MenuItem } from "@/shared/lib/menu-config";
import { cn } from "@/shared/lib/utils";

const RecursiveAccordion = ({
  item,
  value,
  level = 1,
}: {
  item: MenuItem;
  value: string;
  level?: number;
}) => {
  const hasItems = item.items && item.items.length > 0;

  const textStyle =
    level === 1 ? "font-bold text-sm" : "font-medium text-[13px] opacity-90";

  const itemStyle = level === 1 ? "border-b" : "border-none";

  if (!hasItems) {
    return (
      <Link
        href={item.href || "#"}
        className={cn(
          "flex py-3 px-4 hover:bg-accent transition-colors",
          textStyle,
          itemStyle,
        )}
      >
        {item.title}
      </Link>
    );
  }

  return (
    <AccordionItem value={value} className={itemStyle}>
      <AccordionTrigger
        className={cn(
          "py-3 px-4 hover:no-underline hover:bg-accent/50",
          textStyle,
        )}
      >
        {item.title}
      </AccordionTrigger>
      <AccordionContent className="pb-0">
        <div
          className={cn(
            "flex flex-col",
            level === 1 ? "bg-accent/10" : "bg-transparent",
          )}
        >
          <Accordion type="multiple" className="w-full">
            {item.items?.map((subItem, index) => (
              <RecursiveAccordion
                key={index}
                item={subItem}
                value={`${value}-${index}`}
                level={level + 1}
              />
            ))}
          </Accordion>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default function MobileNavigationMenu({
  menuData,
}: {
  menuData: MenuItem[];
}) {
  return (
    <Accordion type="multiple" className="w-full border-t">
      {menuData.map((menu, idx) => (
        <RecursiveAccordion
          key={idx}
          item={menu}
          value={`root-${idx}`}
          level={1}
        />
      ))}
    </Accordion>
  );
}
