"use client";

import { QRCodeSVG } from "qrcode.react";
import logoQR from "@/public/logo_loading.svg";

export default function RegistrationQRCode({ value }: { value: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-sm text-muted-foreground italic">
        {" "}
        Quét QR để tham gia nhóm Zalo
      </p>{" "}
      <div className="p-2 bg-white border border-primary/10 shadow-sm rounded-sm">
        <QRCodeSVG
          value={value}
          size={180}
          bgColor={"#ffffff"}
          fgColor={"#472B20"}
          level={"H"}
          includeMargin={false}
          imageSettings={{
            src: logoQR.src,
            x: undefined,
            y: undefined,
            height: 48,
            width: 48,
            excavate: true,
          }}
          style={{ shapeRendering: "crispEdges" }}
        />
      </div>
    </div>
  );
}
