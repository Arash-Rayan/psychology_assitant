import type { Metadata } from "next";
import "../styles/globals.css";
import "../index.css";
import { BackgroundAnimation } from "@/components/BackgroundAnimation";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Persian Mental Health Website",
  description: "Persian Mental Health Website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="rtl">
      <body>
        <BackgroundAnimation />
        {children}
        <Toaster position="top-center" dir="rtl" richColors />
      </body>
    </html>
  );
}

