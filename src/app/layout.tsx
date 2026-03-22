import type { Metadata, Viewport } from "next";
import {
  EB_Garamond,
  Oswald,
  Lora,
  Montserrat,
  Merriweather,
  Merriweather_Sans,
  Style_Script,
} from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import Footer from "@/shared/layout/Footer";
import Navbar from "@/shared/layout/Navbar";
import ScrollToTopButton from "@/shared/layout/ScrollToTopButton";
import { Toaster } from "sonner";
import MotionWrapper from "@/shared/motion/MotionWrapper";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const lora = Lora({
  subsets: ["latin", "vietnamese"],
  variable: "--font-lora",
  display: "swap",
});
const ebGaramond = EB_Garamond({
  subsets: ["latin", "vietnamese"],
  variable: "--font-eb-garamond",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin", "vietnamese"],
  variable: "--font-montserrat",
  display: "swap",
});

const merriweather = Merriweather({
  subsets: ["latin", "vietnamese"],
  variable: "--font-merriweather",
  display: "swap",
});

const merriweatherSans = Merriweather_Sans({
  subsets: ["latin", "vietnamese"],
  variable: "--font-merriweather-sans",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin", "vietnamese"],
  variable: "--font-oswald",
  display: "swap",
});

const styleScript = Style_Script({
  subsets: ["latin"],
  variable: "--font-script",
  weight: "400",
  display: "swap",
});

const baseUrl = "https://vienkhongni.com";

export const metadata: Metadata = {
  title: {
    default: "Ni Viện Viên Không",
    template: "%s | Ni Viện Viên Không",
  },
  description:
    "Trang web vienkhongni.com ra đời nhằm mục đích cho sự tiện ích đến toàn thể thân hữu, đạo hữu muốn tìm hiểu những sinh hoạt tín ngưỡng, tu tập, văn hoá, giáo dục, xã hội... của Ni Viện Viên Không và Ni Sư Liễu Pháp.",
  keywords: [
    "Ni Viện Viên Không",
    "Ni Sư Liễu Pháp",
    "Ni Viện",
    "Viên Không",
    "Khóa Tu",
    "Khóa Tu Mùa Hè",
    "Đăng Ký Khóa Tu",
    "Vấn Đáp Phật Pháp",
    "Khóa Thiền",
    "Khóa Tu Xuất Gia Gieo Duyên",
  ],
  openGraph: {
    title: "Ni Viện Viên Không",
    description:
      "Trang web vienkhongni.com ra đời nhằm mục đích cho sự tiện ích đến toàn thể thân hữu, đạo hữu muốn tìm hiểu những sinh hoạt tín ngưỡng, tu tập, văn hoá, giáo dục, xã hội... của Ni Viện Viên Không và Ni Sư Liễu Pháp.",
    url: baseUrl,
    siteName: "Ni Viện Viên Không",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Ni Viện Viên Không",
      },
    ],
    locale: "vi_VN",
    phoneNumbers: ["+84 974 469 963"],
    emails: ["lieuphap@gmail.com", "nivienvienkhong2019@gmail.com"],
    type: "website",
    countryName: "Vietnam",
  },
  alternates: {
    canonical: baseUrl,
  },
  metadataBase: new URL(baseUrl),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${ebGaramond.variable} ${lora.variable} ${oswald.variable} ${montserrat.variable} ${merriweather.variable} ${merriweatherSans.variable} ${styleScript.variable} antialiased`}
    >
      <body className={`min-h-screen bg-white`}>
        <Navbar /> <ScrollToTopButton />
        <NextIntlClientProvider>
          {children} <Toaster position="top-right" richColors />{" "}
          <SpeedInsights /> <Analytics />
        </NextIntlClientProvider>
        <MotionWrapper>
          <Footer />
        </MotionWrapper>
      </body>
    </html>
  );
}
