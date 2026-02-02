import React from "react";
import { useTranslations } from "next-intl";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import coverImage from "@/public/homepage-cover.jpg";
import ornament from "@/public/ornament-01.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RetreatCard from "@/components/RetreatCard";
interface RetreatCardProps {
  title: string;
  youtubeId: string;
  id: string;
}
const MOCK_RETREATS: RetreatCardProps[] = [
  {
    title: "Ngày 5 | Khóa II | Khóa Tu Mùa Hè 2025 | NI VIỆN VIÊN KHÔNG",
    youtubeId: "5l1YZ473tTw",
    id: "e2e2e",
  },
];
const CoursePage = () => {
  const t = useTranslations("Retreat");
  return (
    <div className="mx-auto max-w-6xl px-4 w-full">
      {/* <Image
        className="rounded-lg shadow-lg my-6"
        src={coverImage}
        alt="Cover image"
        placeholder="blur"
      /> */}
      <div className="flex flex-1 w-full flex-col gap-6 justify-between mt-6 items-center">
        <div className="flex flex-1 justify-center opacity-80">
          {/* <Image src={lineOrnament} alt="Ornament" className="w-auto h-8" /> */}
        </div>
        <div className="flex flex-1 justify-center mt-0 mb-0">
          <Image
            src={ornament}
            alt="Ornament"
            className="w-auto h-6 opacity-60"
          />
        </div>
        <div>
          <h2 className="font-bold text-lg tracking-widest uppercase whitespace-nowrap relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-px after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
            {t("title")}
          </h2>
        </div>

        <div className="flex w-full mx-auto justify-center">
          <Tabs defaultValue="mua-he">
            <TabsList variant="line">
              <TabsTrigger value="mua-he">Khóa tu mùa hè</TabsTrigger>
              <TabsTrigger value="xuat-gia">
                Khóa tu Xuất Gia Gieo Duyên
              </TabsTrigger>
              <TabsTrigger value="khoa-thien">Khóa thiền 2 ngày</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="w-full flex">
          <Accordion
            type="single"
            collapsible
            defaultValue="item-1"
            className="w-full"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger className="font-bold text-lg">
                2023{" "}
              </AccordionTrigger>
              <AccordionContent>
                <div className="container mx-auto">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-1 lg:grid-cols-1">
                    {MOCK_RETREATS.map((retreat) => (
                      <RetreatCard key={retreat.youtubeId} data={retreat} />
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
