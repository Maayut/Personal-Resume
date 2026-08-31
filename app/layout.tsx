import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Agent 项目案例集",
  description:
    "三个真实 Agent 项目的 STAR 复盘：用工合规、模拟面试与职业决策。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={[geistSans.variable, geistMono.variable, "antialiased"].join(" ")}
      >
        {children}
      </body>
    </html>
  );
}
