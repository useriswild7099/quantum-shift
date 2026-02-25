import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { SachetTicker } from "@/components/UI/SachetTicker";
import { StoreProvider } from "@/components/Providers/StoreProvider";
import { fetchInitialState } from "@/actions/fetchData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quantum Shift | Strategic Disaster Intelligence",
  description: "Prototype disaster relief coordination system",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  // Fetch from MongoDB
  const initialState = await fetchInitialState();

  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-950 text-neutral-100 overflow-x-hidden`}
      >
        {/* Cinematic Desktop Overlays */}
        <div className="desktop-scanline" />
        <div className="desktop-grain" />

        <StoreProvider initialState={initialState}>
          <SachetTicker />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
