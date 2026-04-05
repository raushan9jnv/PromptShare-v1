import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";

import { Header } from "@/components/Header";
import { SidebarWrapper } from "@/components/SidebarWrapper";
import { SiteFooter } from "@/components/SiteFooter";
import { ThemeProvider } from "@/components/ThemeProvider";
import { appConfig } from "@/lib/config";

import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], display: "swap" });
const jetbrainsMono = JetBrains_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(appConfig.siteUrl),
  title: { default: appConfig.name, template: `%s · ${appConfig.name}` },
  description: appConfig.description,
  openGraph: { title: appConfig.name, description: appConfig.description, type: "website", url: appConfig.siteUrl },
  twitter: { card: "summary_large_image", title: appConfig.name, description: appConfig.description },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('promptshare-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()` }} />
      </head>
      <body className="min-h-full bg-surface-primary text-content-primary transition-colors duration-300">
        <ThemeProvider>
          <div className="flex min-h-full flex-col">
            <Header />
            <div className="mx-auto flex w-full max-w-[1440px] flex-1 gap-0">
              <SidebarWrapper />
              <main className="min-w-0 flex-1">{children}</main>
            </div>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
