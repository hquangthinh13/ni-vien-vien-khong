import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/shared/ui/card";
import { Poem } from "../model/poem.types";
import { getImageUrl } from "@/shared/lib/api";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";

interface PoemCardProps {
  poem: Poem;
}

const PoemCard = ({ poem }: PoemCardProps) => {
  const { documentId, title, coverImage } = poem;
  const imageUrl = getImageUrl(coverImage, "medium");
  return (
    <Link href={`/library/poem/${documentId}`}>
      <Card className="rounded-none mx-auto w-full h-full flex flex-col py-0 gap-0 hover:shadow-lg transition overflow-hidden delay-150 duration-300 ease-in-out">
        <CardContent className="flex flex-1 flex-col p-4 gap-6 justify-between">
          <h3 className="text-md font-semibold text-center text-foreground leading-tight">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="hover:underline cursor-pointer">{title}</span>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs md:max-w-sm lg:max-w-md">
                <span>{title}</span>
              </TooltipContent>
            </Tooltip>
          </h3>
        </CardContent>{" "}
        <Image
          src={imageUrl || "/placeholder.jpg"}
          alt={coverImage?.alternativeText || poem.title || "Poem image"}
          width={600}
          height={400}
          className="aspect-16/10 w-full object-cover"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8+Z+hHgAHfwJ364969wAAAABJRU5ErkJggg=="
        />
      </Card>
    </Link>
  );
};

export default PoemCard;
