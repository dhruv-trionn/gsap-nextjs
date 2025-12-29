import CursorFollower from "@/components/CursorFollower";
import Navbar from "@/components/Navbar";
import ScrollSmootherProvider from "@/components/ScrollSmoother";
import SplashCursor from "@/components/SplashCursor";
import type { Metadata } from "next";
import "./globals.css";

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
          <>
            <Navbar />
              {children}
            <CursorFollower />
            <SplashCursor />
          </>
        </ScrollSmootherProvider>
      </body>
    </html>
  );
}
