import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "حاسبة ذكية",
  description: "تطبيق حاسبة مبني باستخدام Next.js"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
