import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import Link from "next/link";

interface NewsCardProps {
  slug: string;
  title: string;
  imageUrl: string | null;
  text: string;
}

const NewsCard = ({ slug, title, imageUrl, text }: NewsCardProps) => {
  return (
    <Link href={`/blog/${slug}`}>
      <Card className="mx-auto w-full h-full flex flex-col py-0 gap-0 hover:shadow-lg transition overflow-hidden delay-150 duration-300 ease-in-out">
        <Image
          src={imageUrl || "/placeholder.jpg"}
          alt={title}
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
            <p className="line-clamp-3 text-sm text-muted-foreground">{text}</p>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs tracking-wider">12:54 28/01/2025</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
export default NewsCard;
