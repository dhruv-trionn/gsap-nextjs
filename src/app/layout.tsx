import CursorFollower from "@/components/CursorFollower";
import Navbar from "@/components/Navbar";
import ScrollSmootherProvider from "@/components/ScrollSmoother";
import SplashCursor from "@/components/SplashCursor";
import type { Metadata } from "next";
import "./globals.css";
import Template from "./template";

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
            <Template>
              {children}
            </Template>
            <CursorFollower />
            <SplashCursor />
          </>
        </ScrollSmootherProvider>
      </body>
    </html>
  );
}
