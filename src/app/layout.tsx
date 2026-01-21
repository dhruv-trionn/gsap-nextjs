import Navbar from "@/components/Navbar";
import ScrollSmootherProvider from "@/components/ScrollSmoother";
import type { Metadata } from "next";
import "./globals.css";
import PageTransition from "./PageTransition";

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
        <PageTransition>
          <ScrollSmootherProvider>
            <Navbar />
            {children}
            {/* <CursorFollower /> */}
            {/* <SplashCursor /> */}
          </ScrollSmootherProvider>
        </PageTransition>
      </body>
    </html>
  );
}
