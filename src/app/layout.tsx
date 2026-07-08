import type { Metadata, Viewport } from "next";
import {
  EB_Garamond,
  Oswald,
  Lora,
  Montserrat,
  Merriweather,
  Merriweather_Sans,
  Style_Script,
  IBM_Plex_Sans,
} from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import Footer from "@/shared/layout/Footer";
import { ScrollProgress } from "@/shared/ui/scroll-progress";

import ScrollToTopButton from "@/shared/layout/ScrollToTopButton";
import { Toaster } from "sonner";
import MotionWrapper from "@/shared/motion/MotionWrapper";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { getAppLocale } from "@/shared/lib/i18n";
import SmoothScrollProvider from "@/shared/motion/SmoothScrollProvider";
import NavbarLayout from "@/shared/layout/NavbarLayout";

const fontMono = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-mono",
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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  metadataBase: new URL(baseUrl),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getAppLocale();

  return (
    <html
      lang={locale}
      className={`${fontMono.variable} ${oswald.variable} ${montserrat.variable} ${merriweather.variable} ${merriweatherSans.variable} ${styleScript.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-background">
        <NextIntlClientProvider>
          <NavbarLayout /> <ScrollToTopButton />
          <ScrollProgress className="h-1" />
          <main className="flex-1">{children}</main>{" "}
          <Toaster position="top-right" richColors /> <SpeedInsights />{" "}
          <Analytics />
          <MotionWrapper>
            <Footer />
          </MotionWrapper>
          <SmoothScrollProvider />{" "}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
