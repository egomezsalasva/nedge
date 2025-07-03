import type { Metadata } from "next";
import localFont from "next/font/local";
import { Header } from "@/app/ui";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEDGE",
  description:
    "NEDGE is the platform to find inspiration for your next outfit.",
  openGraph: {
    title: "NEDGE",
    description:
      "NEDGE is the platform to find inspiration for your next outfit.",
    url: "https://nedgestyle.com",
    images: [
      {
        url: "https://nedgestyle.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NEDGE",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NEDGE",
    description:
      "NEDGE is the platform to find inspiration for your next outfit.",
    images: ["https://nedgestyle.com/og-image.jpg"],
  },
};

const exatCyr = localFont({
  src: [
    {
      path: "../public/fonts/exatcyr/exatcyr-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/exatcyr/exatcyr-medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/exatcyr/exatcyr-bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={exatCyr.className}>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
