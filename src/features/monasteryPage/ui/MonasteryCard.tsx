// "use client";

// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import { Clock, MapPin } from "lucide-react";
// import { getImageUrl } from "@/shared/lib/api";
// import { MonasteryAttributes } from "@/features/monasteryPage/model/monasteryPage.types";
// import { motion } from "framer-motion";
// import { Vibrant } from "node-vibrant/browser";
// import Zoom from "react-medium-image-zoom";
// import "react-medium-image-zoom/dist/styles.css";
// interface MonasteryCardProps {
//   item: MonasteryAttributes;
//   index: number;
// }

// const MonasteryCard = ({ item, index }: MonasteryCardProps) => {
//   const [accentColor, setAccentColor] = useState("#8b5cf6");
//   const imageUrl = getImageUrl(item.coverImage, "medium");

//   const isEven = index % 2 !== 0;

//   useEffect(() => {
//     if (imageUrl) {
//       Vibrant.from(imageUrl)
//         .getPalette()
//         .then((palette) => {
//           setAccentColor(
//             palette.Vibrant?.hex || palette.Muted?.hex || "#8b5cf6",
//           );
//         });
//     }
//   }, [imageUrl]);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 5 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       transition={{
//         duration: 1.3,
//         delay: 0.2,
//         ease: [0.22, 1, 0.36, 1],
//       }}
//       className="group w-full"
//     >
//       <div
//         className={`
//         flex flex-col gap-8 items-center
//         lg:flex-row ${isEven ? "lg:flex-row-reverse" : ""}
//       `}
//       >
//         <div className="w-full lg:w-1/2">
//           <div className="max-w-xl md:max-w-4xl relative aspect-video w-full overflow-hidden rounded-xl shadow-lg transition-shadow group-hover:shadow-xl ease-in-out duration-300 border border-white/10">
//             <Zoom zoomMargin={80}>
//               <Image
//                 src={imageUrl || "/placeholder.png"}
//                 alt={item.monasteryName}
//                 fill
//                 className="object-cover hover:scale-105 transition-transform duration-300"
//                 sizes="(max-width: 768px) 100vw, 50vw"
//                 placeholder="blur"
//                 blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8+Z+hHgAHfwJ364969wAAAABJRU5ErkJggg=="
//               />
//             </Zoom>
//             <div
//               className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
//               style={{ backgroundColor: accentColor }}
//             />
//           </div>
//         </div>

//         <div
//           className={`
//           flex flex-col w-full lg:w-1/2 gap-4
//           text-center ${isEven ? "lg:text-right " : "lg:text-left"}
//         `}
//         >
//           <div className="space-y-3">
//             <h3
//               className="text-2xl lg:text-3xl font-bold leading-tight font-serif"
//               style={{ color: accentColor }}
//             >
//               {item.monasteryName}
//             </h3>

//             <p className="text-secondary-foreground text-md lg:text-lg leading-relaxed">
//               {item.monasteryDescription}
//             </p>
//           </div>

//           <div
//             className={`
//             flex flex-col gap-3 pt-6 border-t border-border/50
//             items-center ${isEven ? "lg:items-end" : "lg:items-start"}
//           `}
//           >
//             <div className="flex items-center font-mono gap-2 text-sm font-medium text-muted-foreground">
//               <div
//                 className="p-1.5 rounded-full bg-secondary"
//                 style={{ color: accentColor }}
//               >
//                 <MapPin className="w-4 h-4" />
//               </div>
//               <span>{item.monasteryAddress}</span>
//             </div>

//             {item.openingHour && (
//               <div className="flex items-center font-mono  gap-2 text-sm font-medium text-muted-foreground">
//                 <div
//                   className="p-1.5 rounded-full bg-secondary"
//                   style={{ color: accentColor }}
//                 >
//                   <Clock className="w-4 h-4" />
//                 </div>
//                 <span>
//                   {item.openingHour.slice(0, 5)} —{" "}
//                   {item.closingHour?.slice(0, 5)}
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default MonasteryCard;
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { MapPin, Clock } from "lucide-react";
import { getImageUrl } from "@/shared/lib/api";
import { MonasteryAttributes } from "@/features/monasteryPage/model/monasteryPage.types";
import { motion } from "framer-motion";
import { Vibrant } from "node-vibrant/browser";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { Locale } from "@/types/locale";
interface MonasteryCardProps {
  item: MonasteryAttributes;
  index: number;
  locale?: Locale;
}

const MonasteryCard = ({ item, index, locale }: MonasteryCardProps) => {
  const [accentColor, setAccentColor] = useState("#8b5cf6");
  const imageUrl = getImageUrl(item.coverImage, "large");
  const isEven = index % 2 !== 0;

  useEffect(() => {
    if (imageUrl) {
      Vibrant.from(imageUrl)
        .getPalette()
        .then((p) => {
          setAccentColor(p.Vibrant?.hex || p.Muted?.hex || "#8b5cf6");
        });
    }
  }, [imageUrl]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-100px" }}
      className="w-full py-12 "
    >
      <div
        className={`flex flex-col lg:flex-row gap-12 items-center max-w-7xl mx-auto`}
      >
        <div
          className={`w-full lg:w-[55%] relative ${isEven ? "lg:order-2" : "lg:order-1"}`}
        >
          <div
            className="absolute -inset-2 blur-xl opacity-20 transition-opacity duration-700 group-hover:opacity-40"
            style={{ backgroundColor: accentColor }}
          />
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-sm shadow-2xl">
            <Zoom zoomMargin={80}>
              <Image
                src={imageUrl || "/placeholder.png"}
                alt={item.monasteryName}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </Zoom>
          </div>
        </div>

        <div
          className={`w-full lg:w-[45%] space-y-8 ${isEven ? "lg:order-1 lg:text-right" : "lg:order-2 lg:text-left"}`}
        >
          <div className="space-y-4">
            <h3
              className="text-4xl md:text-6xl font-bold uppercase tracking-tighter font-serif leading-snug"
              style={{ color: accentColor }}
            >
              {item.monasteryName}
            </h3>

            <div
              className={`flex flex-col gap-6 ${isEven ? "lg:items-end" : "lg:items-start"}`}
            >
              <div className="space-y-1">
                <div
                  className={`flex gap-1 items-center text-muted-foreground ${isEven ? "lg:justify-end" : "lg:justify-start"}`}
                >
                  <MapPin className="w-4 h-4" />
                  <p className="text-sm font-mono uppercase tracking-widest font-medium">
                    {locale === "en" ? "Address" : "Địa chỉ"}
                  </p>
                </div>

                <p className="text-sm md:text-base font-medium">
                  {item.monasteryAddress}
                </p>
              </div>
              {/* <div className="flex items-center gap-2 text-muted-foreground font-mono text-sm uppercase">
                <MapPin className="w-4 h-4" />
                <span>{item.monasteryAddress}</span>
              </div> */}

              {item.openingHour && (
                <div className="space-y-1">
                  <div
                    className={`flex gap-1 items-center text-muted-foreground ${isEven ? "lg:justify-end" : "lg:justify-start"}`}
                  >
                    <Clock className="w-4 h-4" />
                    <p className="text-sm font-mono uppercase tracking-widest font-medium">
                      {locale === "en" ? "Opening Hours" : "Giờ mở cửa"}
                    </p>
                  </div>

                  <p className="text-sm md:text-base font-medium">
                    {item.openingHour.slice(0, 5)} —{" "}
                    {item.closingHour?.slice(0, 5) || "Đóng cửa"}{" "}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className={`relative ${isEven ? "lg:pl-12" : "lg:pr-12"}`}>
            <div
              className={`absolute top-0 bottom-0 w-1 ${isEven ? "right-0" : "left-0"}`}
              style={{ backgroundColor: accentColor, opacity: 0.3 }}
            />
            <p className="text-secondary-foreground leading-relaxed text-md italic px-6">
              {item.monasteryDescription}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MonasteryCard;
