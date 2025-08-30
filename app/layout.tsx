import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";
import Navbar from "@/components/navigation/navbar";
import { ThemeProvider } from "@/context/ThemeProvider";

const inter = localFont({
  src: "./fonts/InterVF.ttf",
  variable: "--font-inter",
  weight: "100 200 300 400 500 600 700 800 900",
});

export const metadata: Metadata = {
  title: "School Management System",
  description:
    "Complete school management solution for administrators, teachers, students, and parents",
  keywords: ["school", "management", "education", "students", "teachers"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
