import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "../styles/globals.css";
import "../index.css";
import { BackgroundAnimation } from "@/components/BackgroundAnimation";
import { Toaster } from "@/components/ui/sonner";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "روانصد | سلامت روان",
  description: "پلتفرم هوشمند سلامت روان برای درمانگران و مراجعان فارسی‌زبان",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className={vazirmatn.className}>
        <BackgroundAnimation />
        {children}
        <Toaster position="top-center" dir="rtl" richColors />
      </body>
    </html>
  );
}

