import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/redux/providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Upforce Machine Round Deep Sutariya",
  description: "Upforce Machine Round Deep Sutariya",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="scroll-smooth">
        <Providers>
          <Navbar />
          <main className="flex flex-col items-center min-h-[calc(100vh-72px)] w-full">
            {children}
          </main>
        </Providers>
        <Footer />
      </body>
    </html>
  );
}
