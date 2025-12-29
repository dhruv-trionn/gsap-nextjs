import ScrollSmootherProvider from "@/components/ScrollSmoother";
import type { Metadata } from "next";
import "./globals.css";
import PageTransition from "@/components/PageTransition";
import SplashCursor from "@/components/SplashCursor";
import CursorFollower from "@/components/CursorFollower";

export const metadata: Metadata = {
  title: "GSAP Animation",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="overflow-x-clip" >
        <ScrollSmootherProvider>
          <PageTransition />
          {children}
            <CursorFollower />
          <SplashCursor />
        </ScrollSmootherProvider>
      </body>
    </html>
  );
}
