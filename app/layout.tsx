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

const title = "AI Agent 项目案例集";
const description =
  "四个真实 Agent 项目的 STAR 复盘：用工合规、模拟面试、职业决策与网申自动化。";
const socialImage =
  "https://raw.githubusercontent.com/Maayut/Personal-Resume/main/public/og.png";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    locale: "zh_CN",
    images: [
      {
        url: socialImage,
        width: 1731,
        height: 909,
        alt: "AI Agent 项目案例集：真实问题、人机协作、可验证结果",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [socialImage],
  },
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
