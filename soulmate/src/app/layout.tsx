import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { PRODUCT } from "@/lib/constants";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${PRODUCT.name} AI | Smart Calendar — ${PRODUCT.company}`,
  description: PRODUCT.tagline,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className={vazirmatn.className}>
        <div className="page-bg" aria-hidden />
        {children}
      </body>
    </html>
  );
}
