import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { TaskTrackerProvider } from "@/lib/storage";
import { Navbar } from "@/components/shared/Navbar";
import { BottomNav } from "@/components/shared/BottomNav";

export const metadata: Metadata = {
  title: "Task tracker",
  description:
    "เว็บแอปพลิเคชันสำหรับติดตามและตรวจสอบการส่งงานค้าง โรงเรียนบรรหารแจ่มใสวิทยา ๓ ใช้งานง่าย รองรับมือถือ 100%",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Prompt:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased font-sans pb-20 lg:pb-8">
        <TaskTrackerProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6">
            {children}
          </main>
          <BottomNav />
        </TaskTrackerProvider>
      </body>
    </html>
  );
}
