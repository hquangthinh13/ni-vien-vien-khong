import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import Link from "next/link";
import { Activity } from "./Activity.type";
import { getImageUrl } from "@/lib/api";
interface ActivityCardProps {
  activity: Activity;
}
const ActivityCard = ({ activity }: ActivityCardProps) => {
  const { slug, title, coverImage, description, publishedAt } = activity;
  const imageUrl = getImageUrl(coverImage);
  return (
    <Link href={`/blog/${slug}`}>
      <Card className="mx-auto w-full h-full flex flex-col py-0 gap-0 hover:shadow-lg transition overflow-hidden delay-150 duration-300 ease-in-out">
        <Image
          src={imageUrl || "/placeholder.jpg"}
          alt={
            coverImage?.alternativeText || activity.title || "Activity image"
          }
          width={600}
          height={400}
          className="aspect-video w-full object-cover"
        />

        <CardContent className="flex flex-1 flex-col p-6 gap-6 justify-between">
          <div className="flex flex-col gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <CardTitle className="line-clamp-2">{title}</CardTitle>
              </TooltipTrigger>
              <TooltipContent className="">
                <p className="text-center max-w-80 leading-relaxed">{title}</p>
              </TooltipContent>
            </Tooltip>
            <p className="line-clamp-3 text-sm text-muted-foreground">
              {description}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs tracking-wider">{publishedAt}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
export default ActivityCard;
