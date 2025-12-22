import ScrollSmootherProvider from "@/components/ScrollSmoother";
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
          {children}
        </ScrollSmootherProvider>
      </body>
    </html>
  );
}
