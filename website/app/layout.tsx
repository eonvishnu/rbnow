import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../context/CartProvider"; 
import { AuthProvider } from "../context/AuthProvider";
import { LocationProvider } from "../context/LocationContext";

import StoreGuard from "./components/StoreGuard";
import { Footer } from "./components/Footer";
import { BottomNav } from "./components/BottomNav";
import { LocationModal } from "./components/LocationModal";
import PWAWrapper from "./components/PWAWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#064e3b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: "Royal Bengal | Culinary Excellence",
    template: "%s | Royal Bengal",
  },
  description: "Boutique sourcing and premium delivery of the finest cuts, fresh catches & authentic groceries.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Royal Bengal",
  },
  icons: {
    apple: "/icons/icon-192x192.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="overflow-x-hidden antialiased">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-white text-gray-900 overflow-x-hidden max-w-[100vw] min-h-screen flex flex-col`}>
        <AuthProvider>
          <LocationProvider>
            <CartProvider>
              <StoreGuard>
                <PWAWrapper />
                <div className="flex flex-col min-h-screen w-full max-w-[100vw] overflow-x-hidden">
                  <main className="flex-grow w-full pb-16 md:pb-0">
                    {children}
                  </main>
                  <Footer />
                  <BottomNav />
                  <LocationModal />
                </div>
              </StoreGuard>
            </CartProvider>
          </LocationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
